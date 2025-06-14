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
        styles.push(`height: ${opts.height}`);
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
      result += ` class="td__fixed"`;
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

    // 解析表格
    const tableStart = state.line;
    const tableRule = md.block.ruler.__rules__.find(rule => rule.name === 'table');
    if (tableRule && tableRule.fn(state, tableStart, end, false)) {
      // 找到表格的所有 token
      const tableTokens = [];
      let tableFound = false;

      for (let i = state.tokens.length - 1; i >= 0; i--) {
        const token = state.tokens[i];
        if (token.type === 'table_open') {
          tableFound = true;
          token.tableOptions = tableOptions;
          break;
        }
      }

      // 为表格中的单元格添加固定列标记
      if (tableFound && (tableOptions.fixedLeft > 0 || tableOptions.fixedRight > 0)) {
        let rowIndex = 0;
        let cellIndex = 0;
        let isInRow = false;
        let totalCells = 0;

        // 首先计算每行的单元格总数
        for (let i = state.tokens.length - 1; i >= 0; i--) {
          const token = state.tokens[i];
          if (token.type === 'table_open') {
            break;
          }
          if (token.type === 'tr_open') {
            let cellCount = 0;
            for (let j = i + 1; j < state.tokens.length; j++) {
              if (state.tokens[j].type === 'tr_close') {
                break;
              }
              if (state.tokens[j].type === 'td_open' || state.tokens[j].type === 'th_open') {
                cellCount++;
              }
            }
            if (cellCount > totalCells) {
              totalCells = cellCount;
            }
          }
        }

        // 为单元格添加固定标记
        rowIndex = 0;
        for (let i = state.tokens.length - 1; i >= 0; i--) {
          const token = state.tokens[i];
          if (token.type === 'table_open') {
            break;
          }
          if (token.type === 'tr_open') {
            isInRow = true;
            cellIndex = 0;
            rowIndex++;
          } else if (token.type === 'tr_close') {
            isInRow = false;
          } else if (isInRow && (token.type === 'td_open' || token.type === 'th_open')) {
            // 检查是否需要固定左侧列
            if (tableOptions.fixedLeft > 0 && cellIndex < tableOptions.fixedLeft) {
              token.cellFixed = true;
            }
            // 检查是否需要固定右侧列
            if (tableOptions.fixedRight > 0 && cellIndex >= (totalCells - tableOptions.fixedRight)) {
              token.cellFixed = true;
            }
            cellIndex++;
          }
        }
      }

      return true;
    }

    return false;
  });
}

export default tablePlugin;