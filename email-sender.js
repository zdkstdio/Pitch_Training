/**
 * 公共邮件发送模块
 * 用于所有ABX实验页面的结果自动发送
 */

// EmailJS 初始化
(function(){
    emailjs.init("YOUR_PUBLIC_KEY"); // 需要替换为实际的EmailJS公钥
})();

/**
 * 自动发送实验结果到指定邮箱
 * @param {Object} config - 配置对象
 * @param {string} config.testType - 测试类型（如 "Low Falling Tone Discrimination (ABX)"）
 * @param {string} config.testName - 测试名称（如 "Low Falling"）
 * @param {boolean} config.hasData - 是否有足够的数据
 * @param {Object} config.jndData - JND相关数据
 * @param {number} config.jndData.absoluteDifference - JND绝对差值
 * @param {number} config.jndData.percentDifference - JND百分比差值
 * @param {number} config.jndData.ratio - JND比率
 * @param {number} config.jndData.webersRatio - Weber比率
 * @param {Object} config.thresholdData - 阈值相关数据
 * @param {number} config.thresholdData.standardWindow - 标准调制窗口
 * @param {number} config.thresholdData.thresholdWindow - 阈值调制窗口
 * @param {number} config.thresholdData.thresholdPercent - 阈值百分比
 * @param {number} config.thresholdData.modulationRate - 调制速率
 * @param {number} config.thresholdData.avgLevel - 平均难度等级
 * @param {number} config.thresholdData.sdLevel - 难度等级标准差
 * @param {Object} config.performanceData - 性能数据
 * @param {number} config.performanceData.totalTrials - 总试验次数
 * @param {number} config.performanceData.correctResponses - 正确响应次数
 * @param {string} config.performanceData.accuracy - 准确率
 * @param {string} config.performanceData.meanRT - 平均反应时间
 * @param {string} config.performanceData.medianRT - 中位反应时间
 * @param {string} config.performanceData.sdRT - 反应时间标准差
 * @param {Object} config.experimentInfo - 实验信息
 * @param {number} config.experimentInfo.reversals - 反转次数
 * @param {number} config.experimentInfo.iterations - 迭代次数
 */
function autoSendResultsToEmail(config) {
    console.log('Preparing to send email automatically...');
    
    // 准备邮件内容
    let emailBody = "Dynamic Pitch Discrimination Test Results (ABX)\\n";
    emailBody += config.testType + "\\n";
    emailBody += "===========================================\\n\\n";
    
    emailBody += "JUST NOTICEABLE DIFFERENCE (JND)\\n";
    emailBody += "--------------------------------\\n";
    emailBody += "JND Absolute Difference: " + (config.hasData ? config.jndData.absoluteDifference.toFixed(2) : "N/A") + " ms\\n";
    emailBody += "JND Percentage Difference: " + (config.hasData ? config.jndData.percentDifference.toFixed(2) : "N/A") + "%\\n";
    emailBody += "JND Ratio (Threshold/Standard): " + (config.hasData ? config.jndData.ratio.toFixed(4) : "N/A") + "\\n";
    emailBody += "Weber's Ratio: " + (config.hasData ? config.jndData.webersRatio.toFixed(4) : "N/A") + "\\n\\n";
    
    emailBody += "THRESHOLD PARAMETERS\\n";
    emailBody += "--------------------\\n";
    emailBody += "Standard Modulation Window: " + config.thresholdData.standardWindow + " ms\\n";
    emailBody += "Threshold Modulation Window: " + (config.hasData ? config.thresholdData.thresholdWindow.toFixed(2) : "N/A") + " ms\\n";
    emailBody += "Threshold Window Percentage: " + (config.hasData ? config.thresholdData.thresholdPercent.toFixed(2) : "N/A") + "%\\n";
    emailBody += "Threshold Modulation Rate: " + (config.hasData ? config.thresholdData.modulationRate.toFixed(4) : "N/A") + " semitones/s\\n";
    emailBody += "Average Difficulty Level: " + (config.hasData ? config.thresholdData.avgLevel.toFixed(2) : "N/A") + "\\n";
    emailBody += "Difficulty Level SD: " + (config.hasData ? config.thresholdData.sdLevel.toFixed(2) : "N/A") + "\\n\\n";
    
    emailBody += "PERFORMANCE STATISTICS\\n";
    emailBody += "----------------------\\n";
    emailBody += "Total Trials: " + config.performanceData.totalTrials + "\\n";
    emailBody += "Correct Responses: " + config.performanceData.correctResponses + "\\n";
    emailBody += "Overall Accuracy: " + config.performanceData.accuracy + "%\\n";
    emailBody += "Mean Reaction Time: " + config.performanceData.meanRT + " ms\\n";
    emailBody += "Median Reaction Time: " + config.performanceData.medianRT + " ms\\n";
    emailBody += "RT Standard Deviation: " + config.performanceData.sdRT + " ms\\n\\n";
    
    emailBody += "EXPERIMENT INFO\\n";
    emailBody += "---------------\\n";
    emailBody += "Test Date: " + new Date().toLocaleString() + "\\n";
    emailBody += "Number of Reversals: " + config.experimentInfo.reversals + "\\n";
    emailBody += "Total Iterations: " + config.experimentInfo.iterations + "\\n";
    
    // 使用EmailJS发送邮件
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: "jiaxin-lindsy.li@connect.polyu.hk",
        subject: "Pitch Training Results - " + config.testName + " (ABX)",
        message: emailBody,
        test_type: config.testType,
        jnd_value: config.hasData ? config.jndData.absoluteDifference.toFixed(2) + " ms" : "N/A",
        accuracy: config.performanceData.accuracy + "%",
        test_date: new Date().toLocaleString()
    })
    .then(function(response) {
        console.log('Email sent successfully!', response.status, response.text);
        // 可以在这里添加一个不显眼的提示，告知用户邮件已发送
        logDebug('Results automatically sent to jiaxin-lindsy.li@connect.polyu.hk');
    }, function(error) {
        console.log('Failed to send email:', error);
        logDebug('Failed to send email automatically: ' + JSON.stringify(error));
    });
}

/**
 * 从实验数据中提取配置并发送邮件
 * 这个函数应该在实验完成时被调用
 */
function sendExperimentResults(testType, testName) {
    // 这个函数会被各个HTML页面调用
    // 它会从全局变量中读取实验数据
    
    const hasData = NumberOfReversals >= MINIMUMREVERSALS;
    
    const rtStats = calculateReactionTimeStats();
    const accuracyStats = calculateAccuracyStats();
    
    const config = {
        testType: testType,
        testName: testName,
        hasData: hasData,
        jndData: {
            absoluteDifference: jndAbsoluteDifference,
            percentDifference: jndPercentDifference,
            ratio: jndRatio,
            webersRatio: webersRatio
        },
        thresholdData: {
            standardWindow: STANDARD_WINDOW,
            thresholdWindow: thresholdWindowDuration,
            thresholdPercent: thresholdWindowPercent,
            modulationRate: thresholdModulationRate,
            avgLevel: sentAverage,
            sdLevel: sentStdev
        },
        performanceData: {
            totalTrials: accuracyStats.total,
            correctResponses: accuracyStats.correct,
            accuracy: accuracyStats.percentage,
            meanRT: rtStats.mean,
            medianRT: rtStats.median,
            sdRT: rtStats.sd
        },
        experimentInfo: {
            reversals: NumberOfReversals,
            iterations: numberOfIterations
        }
    };
    
    autoSendResultsToEmail(config);
}
