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

        // add time stamp to image name to prevent duplicate names
        newName = originalname.split('.');
        newName.pop();
        newName.join('.').replace(/ /g, "_");
        newName = newName + "_" + Date.now() + ".jpg";

        const user = req.body.user
        if(!user){
            res.status(400).send("No user provided")
        }
        
        const blob = bucket.file(newName);
        const blobStream = blob.createWriteStream({resumable: false})

        // performs write to GCS
        blobStream.on('finish', () => {
            const url = `https://storage.googleapis.com/${bucketname}/${newName}`

            Image.create({
                url: url,
                name: newName,
                user: user,
                location: "()"
            })

            res.status(200).send(url);
          })
          .on('error', () => {
            res.status(400).send('Unable to upload image, something went wrong')
          })
          .end(buffer)

	} catch (err) {
        res.status(400).send(err);
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
            where: {name: req.params.name}
        })
        if(deleted){
            await bucket.file(req.params.name).delete()
            res.status(200).send("Successfully Deleted")
        }
        else{
            res.status(400).send("There was a problem deleting this image")
        }
    } catch (err) {
        next(err)
    }
}




module.exports = imageController;
