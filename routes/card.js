const signale = require('../utils/signale');
const config = require('config');
const axios = require('axios');

module.exports = (app) => {
    const serverConfig = config.get('server');
    const paramsConfig = config.get('params');
    const apisConfig = config.get('apis');
    const context = serverConfig.context;

    app.post(encodeURI(context + '/card'), async (req, res) => {
        try {
            const { type } = req.body;
            const id_list_to_do = "5f81f78f8e64647299bf0695";
            const id_board = "5f81f78f8e64647299bf0694";
            const { description } = req.body;
            switch (type) {
                case "issue": {
                    const { title } = req.body;
                    const urlNewCard = encodeURI(`${apisConfig.trello}/1/cards?key=${paramsConfig.key}&token=${paramsConfig.token}&idList=${id_list_to_do}`);
                    signale.info("url post", encodeURI(urlNewCard));

                    const response = await axios.post(urlNewIssue, { "name": title, "desc": description });
                    signale.info("The response is", response)
                    res.json({ status: "200", message: "sucess." });
                    break;
                }
                case "bug": {            
                    const id_label_bug="5f81f78fcdabcf46c07a092b"
                    const urlNewCard = encodeURI(`${apisConfig.trello}/1/cards?key=${paramsConfig.key}&token=${paramsConfig.token}&idList=${id_list_to_do}`);
                    signale.info("url post", encodeURI(urlNewCard))

                    //Get Members
                    const urlGetMembers = encodeURI(`${apisConfig.trello}/1/boards/${id_board}/memberships?key=${paramsConfig.key}&token=${paramsConfig.token}&idList=${id_list_to_do}`);
                    const responseMembers = await axios.get(urlGetMembers);

                    const aleatoryMember = Math.round(Math.random() * (responseMembers.data.length - 1));
                    const aleatoryNumber = Math.round(Math.random() * (100 - 1));

                    const word = description.substr(0, description.indexOf(" "));
                    const title = `bug-${word}-${aleatoryNumber}`;

                    const response = await axios.post(urlNewCard, { "name": title, "desc": description, "idMembers": [responseMembers.data[aleatoryMember].idMember], "idLabels": [id_label_bug]});
                    signale.info("The response is", response)
                    res.json({ status: "200", message: "sucess." });

                    break;
                }
                case "task": {
                    const urlNewCard = encodeURI(`${apisConfig.trello}/1/cards?key=${paramsConfig.key}&token=${paramsConfig.token}&idList=${id_list_to_do}`);
                    signale.info("url post", encodeURI(urlNewCard))
                    const {title, category}=req.body;
                    let id_label="";
                    switch(category){
                        case "Maintenance":
                            id_label="5f81f78fcdabcf46c07a0927";
                            break;
                        case "Research":
                            id_label="5f81f78fcdabcf46c07a0924";
                            break;
                        case "Test":
                            id_label="5f81f78fcdabcf46c07a0929";
                            break;
                    }

                    const response = await axios.post(urlNewCard, { "name": title, "desc": description, "idLabels": [id_label]});
                    signale.info("The response is", response)
                    res.json({ status: "200", message: "sucess." });
                    break;
                }
                default: {
                    res.json({ status: "409", message: "The card type was not recognized." });
                    break;
                }
            }
        } catch (error) {
            signale.error(error)
            res.json({ status: "409", message: "The card could not be created." });
        }
    });
}