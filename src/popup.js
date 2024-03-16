const defaultRules = [
    {
        urlRegex: 'figma',
        contentKeywords: ['in Figma app'],
        delayTime: 1000
    }
]

function resetDefaultRules() {
  chrome.storage.sync.set({ rules: defaultRules }, function() {
      console.log('Default rules set.');
      displayRules(); // 更新UI显示默认规则
  });
}

function initializeDefaultRules() {
    chrome.storage.sync.get('rules', function(data) {
        if (!data.rules || data.rules.length === 0) {
            chrome.storage.sync.set({ rules: defaultRules }, function() {
                console.log('Default rules set.');
                displayRules(); // 更新UI显示默认规则
            });
        }
    });
}

function saveRules(rules) {
    chrome.storage.sync.set({ rules: rules }, function() {
        console.log('Rules updated');
        displayRules();
    });
}

function displayRules() {
    chrome.storage.sync.get('rules', function(data) {
        const rulesList = document.getElementById('rulesList');
        const rulesTitle = document.getElementById('rulesTitle');
        
        // 清空现有的规则列表和标题内容
        rulesList.innerHTML = '';
        rulesTitle.textContent = 'Existing Rules'; // 可以根据实际需求调整标题文本

        const rules = data.rules || [];
        
        if (rules.length === 0) {
            // 如果没有规则，显示一个友好的消息
            rulesList.innerHTML = '<p>No rules defined. Add new rules to get started.</p>';
        } else {
            // 否则，为每个规则创建并显示元素
            rules.forEach(function(rule, index) {
              console.log('rule:', rule);
              const ruleElement = document.createElement('div');
              ruleElement.className = 'rule';
              const urlText = document.createTextNode(`URL 匹配正则表达式: ${rule.urlRegex}`);
              const keywordsText = document.createTextNode(`关键词: ${rule.contentKeywords.join(", ")}`);
              const delayTimeText = document.createTextNode(`延迟时间(毫秒): ${rule.delayTime}`);
              ruleElement.appendChild(urlText);
              ruleElement.appendChild(document.createElement('br'));
              ruleElement.appendChild(keywordsText);
              ruleElement.appendChild(document.createElement('br'));
              ruleElement.appendChild(delayTimeText);
              const deleteButton = document.createElement('button');
              deleteButton.textContent = 'Delete';
              deleteButton.onclick = function() {
                  const updatedRules = [...data.rules];
                  updatedRules.splice(index, 1);
                  saveRules(updatedRules);
              };
              ruleElement.appendChild(deleteButton);
              rulesList.appendChild(ruleElement);
            });
        }
    });
}


document.getElementById('addRule').addEventListener('click', function() {
    const urlRegex = document.getElementById('urlKeyword').value;
    const contentKeywords = document.getElementById('contentKeywords').value.split(',').map(s => s.trim()); // 假设用户通过逗号分隔输入多个字符串
    const delayTime = parseInt(document.getElementById('delayTime').value, 10) || 0; // 默认值为0

    if (urlRegex && contentKeywords.length) {
        chrome.storage.sync.get('rules', function(data) {
            const rules = data.rules || [];
            rules.push({ urlRegex, contentKeywords, delayTime });
            saveRules(rules);
            // 清空输入框
            document.getElementById('urlKeyword').value = '';
            document.getElementById('contentKeywords').value = '';
            document.getElementById('delayTime').value = '';
        });
    }
});




document.getElementById('resetRules').addEventListener('click', function() {
    resetDefaultRules()
});

// 在DOM加载完成后初始化默认规则
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultRules();
    displayRules(); // 确保也调用displayRules来显示已有的或默认的规则
});


