const signale = require('../utils/signale');
const config = require('config');
const axios = require('axios');

module.exports = (app) => {
    const serverConfig = config.get('server');
    const context = serverConfig.context;

    const paramsConfig = config.get('params');
    const apisConfig = config.get('apis');

    app.post(encodeURI(context + '/card'), async (req, res) => {
        try {
            const { type, description } = req.body;
            const urlNewCard = encodeURI(`${apisConfig.trello}/1/cards?key=${paramsConfig.key}&token=${paramsConfig.token}&idList=${paramsConfig.id_list_to_do}`);
            switch (type) {
                case "issue": {
                    const { title } = req.body;
                    if (title && description) {
                        signale.info("url post", urlNewCard);

                        //Create an issue card.
                        const response = await axios.post(urlNewCard, { "name": title, "desc": description });
                        signale.info("The response is", response);

                        res.json({ status: "200", message: "sucess.", body: { idCard: response.data.id } });
                    }
                    else { //The parameters are not correct for an issue
                        res.json({ status: "409", message: "To create an issue card you need a title and a description." });
                    }
                    break;
                }
                case "bug": {
                    if (description) {
                        signale.info("url post", encodeURI(urlNewCard))

                        //Get Members
                        const urlGetMembers = encodeURI(`${apisConfig.trello}/1/boards/${paramsConfig.id_board}/memberships?key=${paramsConfig.key}&token=${paramsConfig.token}`);
                        const responseMembers = await axios.get(urlGetMembers);

                        //This function is a random in the member array
                        const aleatoryMember = Math.round(Math.random() * (responseMembers.data.length - 1));
                        const idMember = responseMembers.data[aleatoryMember].idMember;
                        
                        //Function that calculates random number between 1 and 100 for the title
                        const aleatoryNumber = Math.round(Math.random() * (100 - 1));
                        
                        //The random word in the title is the first in the description
                        const word = description.substr(0, description.indexOf(" "));

                        const title = `bug-${word}-${aleatoryNumber}`;

                        //Create a bug card.
                        const response = await axios.post(urlNewCard, { "name": title, "desc": description, "idMembers": [idMember], "idLabels": [paramsConfig.id_label_bug] });
                        signale.info("The response is", response)
                        
                        res.json({ status: "200", message: "sucess.", body: { idCard: response.data.id } });
                    }
                    else { //The parameters are not correct for a bug
                        res.json({ status: "409", message: "To create a bug card you need a description." });
                    }
                    break;
                }
                case "task": {
                    const { title, category } = req.body;
                    if (title && category) {
                        signale.info("url post", encodeURI(urlNewCard))
                        let id_label = "";
                        
                        switch (category) {
                            case "Maintenance":
                                id_label = paramsConfig.id_label_maintenance;
                                break;
                            case "Research":
                                id_label = paramsConfig.id_label_research;
                                break;
                            case "Test":
                                id_label = paramsConfig.id_label_test;
                                break;
                            default: //Category is not accepted
                                res.json({ status: "409", message: "For a task card the accepted categories are: Maintenance, research and test." });
                                break;
                        }
                        
                        //Create a task card.
                        const response = await axios.post(urlNewCard, { "name": title, "idLabels": [id_label] });
                        signale.info("The response is", response)
                        res.json({ status: "200", message: "sucess.", body: { idCard: response.data.id } });
                    }
                    else { //The parameters are not correct for a task
                        res.json({ status: "409", message: "To create a task card you need a title and a category." });
                    }
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