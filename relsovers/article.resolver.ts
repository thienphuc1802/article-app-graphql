import Article from "../models/article.model";
import Category from "../models/category.model";

export const resolversArticle = {
    Query: {

        getListArticle: async (_, args) => {
            const { sortKey, sortValue, currentPage, limitItems, filterKey, filterValue, keyword } = args;
            const sort = {}
            if (sortKey && sortValue) {
                sort[sortKey] = sortValue;
            }
            const find = {
                deleted: false
            }
            if (filterKey && filterValue) {
                find[filterKey] = filterValue;
            }
            if (keyword) {
                const keywordRegex = new RegExp(keyword, 'i');
                find["title"] = keywordRegex;
            }
            const skip = (currentPage - 1) * limitItems;
            const articles = await Article.find(find).sort(sort).limit(limitItems).skip(skip);

            return articles;
        },
        getArticle: async (_, args) => {
            const { id } = args;
            const article = await Article.findById({
                _id: id, deleted: false
            });
            return article;
        }

    },
    Article: {
        category: async (article) => {
            const categoryId = article.categoryId;
            const category = await Category.findOne({
                _id: categoryId, deleted: false
            });
            return category;


        }
    },
    Mutation: {
        createArticle: async (_, args) => {
            const { article } = args;
            const newArticle = new Article(article);
            await newArticle.save();
            return newArticle;
        },
        updateArticle: async (_, args) => {
            const { id, article } = args;
            await Article.updateOne(
                { _id: id },
                article,
            );
            const newArticle = await Article.findOne({
                _id: id, deleted: false
            });
            return newArticle;
        },
        deleteArticle: async (_, args) => {
            const { id } = args;
            await Article.updateOne(
                { _id: id, deleted: false },
                {
                    deleted: true,
                    deletedAt: new Date()
                },
            );
            return " Da xoa";
        },

    }

};