var path = require('path');
const { Image } = require("../database/models");

const imageController = {
    upload: upload,
    getImages: getImages,
    deleteImage: deleteImage
};

const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: './controllers/winter-sum-291420-0255688cea3a.json' });
const bucketname = 'dig-drawings'
const bucket = storage.bucket(bucketname);


async function upload(req, res, next) {
	try {
        const { originalname, buffer } = req.file;
        newName = originalname.split('.');
        newName.pop();
        newName.join('.').replace(/ /g, "_");
        newName = newName + "_" + Date.now() + ".jpg";
        console.log(newName)
        
        const blob = bucket.file(newName);

        const blobStream = blob.createWriteStream({resumable: false})

        blobStream.on('finish', () => {
            const url = `https://storage.googleapis.com/${bucketname}/${newName}`

            Image.create({
                url: url,
                user: 'jordan@gmail.com',
                location: "()"
            })

            res.status(200).send(url);
          })
          .on('error', () => {
            res.status(400).send('Unable to upload image, something went wrong')
          })
          .end(buffer)

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
        
        const cloudDelete = await bucket.file('test2.jpg').delete()
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
