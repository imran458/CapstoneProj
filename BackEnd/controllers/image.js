var path = require('path');
const { Image } = require("../database/models");

const imageController = {
    upload: upload,
    getImages: getImages
};


async function upload(req, res, next) {
	try {
        const { Storage } = require('@google-cloud/storage');

        const storage = new Storage({ keyFilename: './controllers/winter-sum-291420-0255688cea3a.json' });
        // Replace with your bucket name and filename.
        const bucketname = 'dig-drawings';
        const filename = 'test2.jpg'
        const file = path.join(__dirname, filename);

        const response = await storage.bucket(bucketname).upload(file);
        console.log(response)
        await storage.bucket(bucketname).file(filename).makePublic();


		res.status(200).send(`https://storage.googleapis.com/${bucketname}/${filename}`);
	} catch (err) {
		next(err);
	}
}

async function getImages(req, res, next){
    try{
        const images = await Image.findAll({
            where: {
                user: req.params.email
            }
        })
        res.status(200).json(images);
    } catch (err) {
        console.log(err)
        next(err);
    }
}




module.exports = imageController;
