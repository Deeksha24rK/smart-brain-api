const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();

const handleApiCall = (req, res) => {
    const { imageURL } = req.body
    const PAT = 'd1b4b3da011e4c58ae317e8e4d31a9f4';
    const USER_ID = '59zf7da7czjz';
    const APP_ID = 'my-first-application-0290u';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageURL;
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + PAT);

    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }
            res.json(response)
        }
    );
}

const handleImage = (req, res, db) => {
    const { id } = req.body
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entryCount => {
            res.json(entryCount[0].entries)
        })
        .catch(err => res.status(400).json("Unable to get"))
}

module.exports = {
    handleImage, handleApiCall
}