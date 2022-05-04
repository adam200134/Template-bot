var { Embed, ICommandBuilder, TmpEb } = require('../../setting/Builder'), { weather } = require('../../config.json')
const axios = require('axios');

new ICommandBuilder()
    .setName('weather').setDescription('Weather forecast')
    .addStringOption(option => option.setName('county').setDescription('e.g. OO市 or XX縣').setRequired(true)
        .addChoices({ name: "臺北市", value: "臺北市" },
            { name: "新北市", value: "新北市" }, { name: "桃園市", value: "桃園市" }, { name: "臺中市", value: "臺中市" },
            { name: "臺南市", value: "臺南市" }, { name: "高雄市", value: "高雄市" }, { name: "新竹縣", value: "新竹縣" },
            { name: "苗栗縣", value: "苗栗縣" }, { name: "彰化縣", value: "彰化縣" }, { name: "南投縣", value: "南投縣" },
            { name: "雲林縣", value: "雲林縣" }, { name: "嘉義縣", value: "嘉義縣" }, { name: "屏東縣", value: "屏東縣" },
            { name: "宜蘭縣", value: "宜蘭縣" }, { name: "花蓮縣", value: "花蓮縣" }, { name: "臺東縣", value: "臺東縣" },
            { name: "澎湖縣", value: "澎湖縣" }, { name: "金門縣", value: "金門縣" }, { name: "連江縣", value: "連江縣" },
            { name: "基隆市", value: "基隆市" }, { name: "新竹市", value: "新竹市" }, { name: "嘉義市", value: "嘉義市" }))
    .setexec(async (interaction) => {
        const countyName = interaction.options.getString('county');
        const apiUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${weather}`;
        axios.get(apiUrl).then(({ data }) => {
            if (!data) {
                return interaction.reply('沒有找到資料');
            }
            const list = data.records.location;
            //console.log(list);
            let targetRegion = {};
            for (let place of list) {
                //console.log(place);
                if (place.locationName === countyName) {
                    targetRegion = place;
                    break;
                }
            }
            //console.log(regionList);
            if (targetRegion === {}) {
                interaction.reply('請檢查城市名稱是否正確(正體簡體亦會有影響)');
            }
            else if (!targetRegion.weatherElement) {
                interaction.reply('無法預期之錯誤');
            }
            else {
                const infoEmbed = new Embed(true).setTitle(`${countyName} 36小時天氣預報`)
                for (let i = 0; i < 3; i++) { //36hr/12hr = 3
                    let info = "";
                    for (let j = 0; j < targetRegion.weatherElement.length; j++) {
                        if (targetRegion.weatherElement[j].elementName === 'PoP') {
                            info += "降雨機率：" + targetRegion.weatherElement[j].time[i].parameter.parameterName + " %\n";
                        }
                        else if (targetRegion.weatherElement[j].elementName === 'MinT') {
                            info += "最低溫度：" + targetRegion.weatherElement[j].time[i].parameter.parameterName + " °C\n";
                        }
                        else if (targetRegion.weatherElement[j].elementName === 'MaxT') {
                            info += "最高溫度：" + targetRegion.weatherElement[j].time[i].parameter.parameterName + " °C\n";
                        }
                        else {
                            info += targetRegion.weatherElement[j].time[i].parameter.parameterName + "\n";
                        }
                    }
                    infoEmbed.addField(
                        `${targetRegion.weatherElement[0].time[i].startTime}~${targetRegion.weatherElement[0].time[i].endTime}`,
                        info,
                        true
                    );
                }
                //infoEmbed.setFooter(`資料發布時間：${regionList[0].PublishTime}`);
                interaction.reply({ embeds: [infoEmbed] });
            }
        });
    })


//  https://api.openweathermap.org/data/2.5/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid=${1e039c9737c2b3c3db65a0222840cfcd}