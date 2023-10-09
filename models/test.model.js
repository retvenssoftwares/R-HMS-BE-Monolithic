import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;


const articleSchema = Schema({

    title:{
        type: String,
        required: false,
    },

    body:{
        type: String,
        required: false,
    },

    article_image: {
        type: String,
        required: false,
    },

    date:{
        type: Date,
        default: Date.now(),
    }

});


export default Article = model("Article", articleSchema);