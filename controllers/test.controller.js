import ArticleService from "../services/ArticleService";

export default class Article {

    static async apiGetAllArticles(req, res, next) {
        try {
            const articles = await getAllArticles();
            if (!articles) {
                res.status(404).json("There are no article published yet!")
            }
            res.json(articles);
        } catch (error) {
            res.status(500).json({ error: error })
        }

    }
    static async apiCreateArticle(req, res, next) {
        try {
            const createdArticle = await ArticleService.createArticle(req.body);
            res.json(createdArticle);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}


