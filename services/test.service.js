import Article from "../models/Article";

export default class ArticleService {
    static async getAllArticles() {
        try {
            const allArticles = await find();
            return allArticles;
        } catch (error) {
            console.log(`Could not fetch articles ${error}`)
        }
    }
    static async createArticle(data) {
        try {

            const newArticle = {
                title: data.title,
                body: data.body,
                article_image: data.article_image
            }
            const response = await new Article(newArticle).save();
            return response;
        } catch (error) {
            console.log(error);
        }

    }
}