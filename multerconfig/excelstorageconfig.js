const multer = require("multer");


// storage config
const storage = multer.diskStorage({
    
    destination:(req,file,callback)=>{
        callback(null,"./uploadsexcel")
    },
    filename:(req,file,callback)=>{
        const filename = `Excel-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});

// filter 
const filefilter = (req,file,callback)=>{
    if(file.mimetype.includes('excel') || file.mimetype.includes('application/json') || file.originalname.endsWith('.xlsx') ){
        callback(null,true)
    }else{
        callback(null,false)
        return callback(new Error("Only .png .jpg & .jpeg formatted Allowed"))
    }
}

const uploadExcel = multer({
    storage:storage,
    fileFilter:filefilter
});

module.exports = uploadExcel;