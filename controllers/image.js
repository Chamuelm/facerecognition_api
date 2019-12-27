const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
    apiKey: 'd74a49ea5cea4a9e8d8986dd96ecb910'
});

const handleImage = (db) => (req, res) => {
    const { id, imageUrl } = req.body;
    console.log("Received an image request with body: ", req.body);

    clarifai.models.predict('a403429f2ddf4b49b307e318f00e528b', imageUrl)
        .then(response => {
            console.log("Received response from API: ", response);
            if (response) {
                db('users')
                    .where({id})
                    .increment('entries', 1)
                    .returning('entries')
                    .then(entries => res.json({
                        entries: entries,
                        apiResponse: response
                    }))
                    .catch(err => {
                        console.log("Error while updating entries for id ", id, ": ", err);
                        res.status(400).json("Error updating entries");
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json("Backend error");
        });

    
 }

module.exports = {
    handleImage: handleImage
}