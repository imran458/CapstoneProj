var path = require('path');
const { Image } = require("../database/models");

const imageController = {
    upload: upload,
    getImages: getImages,
    deleteImage: deleteImage
};

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: './controllers/winter-sum-291420-0255688cea3a.json' });
const bucketname = 'dig-drawings';
const filename = 'test2.jpg'


async function upload(req, res, next) {
	try {
        const { originalname, buffer } = req.file;
        console.log(typeof(originalname));
        newName = originalname.split('.');
        newName.pop();
        newName.join('.').replace(/ /g, "_");
        newName = newName + "_" + Date.now() + ".jpg";
        console.log(newName)
        const file = path.join(__dirname, filename);

        const response = await storage.bucket(bucketname).upload(file);
        console.log(response)
        await storage.bucket(bucketname).file(filename).makePublic();
        const url = `https://storage.googleapis.com/${bucketname}/${filename}`

        Image.create({
            url: url,
            user: 'jordan@gmail.com',
            location: "()"
        })


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

async function deleteImage(req, res, next){
    try{
        const deleted = await Image.destroy({
            where: {id: req.params.id}
        })
        
        const cloudDelete = await storage.bucket(bucketname).file(filename).delete()
        console.log(cloudDelete)
        if(deleted){
            res.status(200).send("Successfully Deleted")
        }
        else{
            res.status(400).send("There was a problem deleting this image")
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
}




module.exports = imageController;
