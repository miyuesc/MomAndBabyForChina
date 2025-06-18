/**
 * VitePress 表格插件
 * 解析 :table:(参数) 语法并为表格添加样式
 */

function parseTableOptions(optionsStr) {
  const options = {
    width: null,
    height: null,
    fixedHeader: false,
    fixedLeft: 0,
    fixedRight: 0
  };

  // 移除括号并按逗号分割
  const params = optionsStr.replace(/[()]/g, '').split(',');

  params.forEach(param => {
    const trimmed = param.trim();
    if (!trimmed) return;

    if (trimmed.includes('=')) {
      const [key, value] = trimmed.split('=').map(s => s.trim());

      switch (key) {
        case 'width':
          options.width = value;
          break;
        case 'height':
          options.height = value;
          break;
        case 'fixedHeader':
          options.fixedHeader = value === 'true';
          break;
        case 'fixedLeft':
          if (value === 'true') {
            options.fixedLeft = 1;
          } else if (!isNaN(parseInt(value))) {
            options.fixedLeft = parseInt(value);
          }
          break;
        case 'fixedRight':
          if (value === 'true') {
            options.fixedRight = 1;
          } else if (!isNaN(parseInt(value))) {
            options.fixedRight = parseInt(value);
          }
          break;
      }
    }
  });

  return options;
}

function tablePlugin(md) {
  // 保存原始的表格渲染规则
  const defaultTableOpen = md.renderer.rules.table_open || function (tokens, idx, options, env, renderer) {
    return '<table>';
  };

  const defaultTrOpen = md.renderer.rules.tr_open || function (tokens, idx, options, env, renderer) {
    return '<tr>';
  };

  const defaultTdOpen = md.renderer.rules.td_open || function (tokens, idx, options, env, renderer) {
    return '<td>';
  };

  const defaultThOpen = md.renderer.rules.th_open || function (tokens, idx, options, env, renderer) {
    return '<th>';
  };

  // 重写表格开始标签渲染
  md.renderer.rules.table_open = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx];
    let result = '<table';

    // 检查是否有表格配置
    if (token.tableOptions) {
      const opts = token.tableOptions;

      // 添加 class
      let classes = [];
      if (opts.fixedHeader) {
        classes.push('table__fixed-header');
      }
      if (classes.length > 0) {
        result += ` class="${classes.join(' ')}"`;
      }

      // 添加样式
      let styles = [];
      if (opts.width) {
        styles.push(`width: ${opts.width}`);
      }
      if (opts.height) {
        styles.push(`max-height: ${opts.height}`);
      }
      if (styles.length > 0) {
        result += ` style="${styles.join('; ')}"`;
      }
    }

    result += '>';
    return result;
  };

  // 重写 td 和 th 开始标签渲染
  function renderCellOpen(tokens, idx, options, env, renderer, tagName) {
    const token = tokens[idx];
    let result = `<${tagName}`;

    // 检查是否需要添加固定列样式
    if (token.cellFixed) {
      let classes = ['fixed__td'];
      if (token.cellFixedType === 'left') {
        classes.push('fixed__left');
        classes.push(`fixed__left-${token.cellFixedIndex}`);
      } else if (token.cellFixedType === 'right') {
        classes.push('fixed__right');
        classes.push(`fixed__right-${token.cellFixedIndex}`);
      }
      result += ` class="${classes.join(' ')}"`;

      // 添加data属性用于CSS计算
      if (token.cellFixedType === 'left') {
        result += ` data-fixed-left="${token.cellFixedIndex}"`;
      } else if (token.cellFixedType === 'right') {
        result += ` data-fixed-right="${token.cellFixedIndex}"`;
      }
    }

    result += '>';
    return result;
  }

  md.renderer.rules.td_open = function (tokens, idx, options, env, renderer) {
    return renderCellOpen(tokens, idx, options, env, renderer, 'td');
  };

  md.renderer.rules.th_open = function (tokens, idx, options, env, renderer) {
    return renderCellOpen(tokens, idx, options, env, renderer, 'th');
  };

  // 解析规则
  md.block.ruler.before('table', 'custom_table', function (state, start, end, silent) {
    const pos = state.bMarks[start] + state.tShift[start];
    const max = state.eMarks[start];
    const line = state.src.slice(pos, max);

    // 检查是否匹配 :table:(参数) 格式
    const match = line.match(/^:table:\(([^)]+)\)\s*$/);
    if (!match) {
      return false;
    }

    if (silent) {
      return true;
    }

    // 解析参数
    const tableOptions = parseTableOptions(match[1]);

    // 查找下一行是否是表格
    let nextLine = start + 1;
    if (nextLine >= end) {
      return false;
    }

    const nextPos = state.bMarks[nextLine] + state.tShift[nextLine];
    const nextMax = state.eMarks[nextLine];
    const nextLineContent = state.src.slice(nextPos, nextMax);

    // 检查下一行是否是表格格式（包含 | 符号）
    if (!nextLineContent.includes('|')) {
      return false;
    }

    // 跳过当前行
    state.line = start + 1;

    // 记录解析前的token数量
    const tokensBeforeTable = state.tokens.length;

    // 解析表格
    const tableStart = state.line;
    const tableRule = md.block.ruler.__rules__.find(rule => rule.name === 'table');

    if (tableRule && tableRule.fn(state, tableStart, end, false)) {
      // 找到新添加的表格tokens
      const newTokens = state.tokens.slice(tokensBeforeTable);
      let tableOpenIndex = -1;

      // 找到table_open token的索引
      for (let i = 0; i < newTokens.length; i++) {
        if (newTokens[i].type === 'table_open') {
          tableOpenIndex = tokensBeforeTable + i;
          break;
        }
      }

      if (tableOpenIndex !== -1) {
        // 为table_open token添加配置
        state.tokens[tableOpenIndex].tableOptions = tableOptions;

        // 如果需要固定列，处理单元格
        if (tableOptions.fixedLeft > 0 || tableOptions.fixedRight > 0) {
          processFixedColumns(state.tokens, tableOpenIndex, tableOptions);
        }
      }

      return true;
    }

    return false;
  });

  // 处理固定列的函数
  function processFixedColumns(tokens, tableStartIndex, tableOptions) {
    let totalCells = 0;
    let currentRowCells = 0;
    let isInTable = false;
    let isInRow = false;

    // 首先计算表格的最大列数
    for (let i = tableStartIndex; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'table_open') {
        isInTable = true;
        continue;
      }

      if (token.type === 'table_close') {
        isInTable = false;
        break;
      }

      if (!isInTable) continue;

      if (token.type === 'tr_open') {
        isInRow = true;
        currentRowCells = 0;
        continue;
      }

      if (token.type === 'tr_close') {
        isInRow = false;
        if (currentRowCells > totalCells) {
          totalCells = currentRowCells;
        }
        continue;
      }

      if (isInRow && (token.type === 'td_open' || token.type === 'th_open')) {
        currentRowCells++;
      }
    }

    // 重新遍历，为需要固定的单元格添加标记
    isInTable = false;
    isInRow = false;
    let cellIndex = 0;

    for (let i = tableStartIndex; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === 'table_open') {
        isInTable = true;
        continue;
      }

      if (token.type === 'table_close') {
        isInTable = false;
        break;
      }

      if (!isInTable) continue;

      if (token.type === 'tr_open') {
        isInRow = true;
        cellIndex = 0;
        continue;
      }

      if (token.type === 'tr_close') {
        isInRow = false;
        continue;
      }

      if (isInRow && (token.type === 'td_open' || token.type === 'th_open')) {
        // 检查是否需要固定左侧列
        if (tableOptions.fixedLeft > 0 && cellIndex < tableOptions.fixedLeft) {
          token.cellFixed = true;
          token.cellFixedType = 'left';
          token.cellFixedIndex = cellIndex;
        }
        // 检查是否需要固定右侧列
        else if (tableOptions.fixedRight > 0 && cellIndex >= (totalCells - tableOptions.fixedRight)) {
          token.cellFixed = true;
          token.cellFixedType = 'right';
          token.cellFixedIndex = totalCells - cellIndex - 1;
        }

        cellIndex++;
      }
    }
  }
}

export default tablePlugin;
