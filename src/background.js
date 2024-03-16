chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get('rules', function(data) {
            const rules = data.rules || [];
            rules.forEach(rule => {
                try {
                    const regex = new RegExp(rule.urlRegex);
                    if (regex.test(tab.url)) {
                        console.log('tab.url:', tab.url);
                        // 匹配URL后，注入脚本检查页面内容
                        console.log('rule.contentKeywords:', rule.contentKeywords);
                        // 在匹配规则后
                        rule.contentKeywords.forEach(keyword => {
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                function: pageScript,
                                args: [keyword, rule.delayTime || 1000], // 添加 delayTime，如果未定义则默认为1000
                            });
                        });
                    }
                } catch(e) {
                    console.error('Invalid Regex:', e);
                }
            });
        });
    }
});





function pageScript(keyword, delayTime) {
    setTimeout(() => {
        if (document.body.innerText.includes(keyword)) {
            chrome.runtime.sendMessage({action: "closeTab", tabId: keyword});
        }
    }, delayTime); // 使用传递的延迟时间
}

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action === "closeTab" && sender.tab) {
        chrome.tabs.remove(sender.tab.id);
    }
});
