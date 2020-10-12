const appRouter = (app, version) => {

    require('./card')(app);

    app.get("/", (req, res) => {
        res.status(200).send(`Welcome Space-X - version ${encodeURI(version)}`);
    });
}

module.exports = appRouter;