
import Category from "../models/category.model";

export const resolversCategory = {
    Query: {
        getListCategory: async () => {
            const category = await Category.find({
                deleted: false
            });
            return category;
        },
        getCategory: async (_, args) => {
            const { id } = args;
            const category = await Category.findById({
                _id: id, deleted: false
            });
            return category;
        }
    },

    Mutation: {

        createCategory: async (_, args) => {
            const { category } = args;
            const newCategory = new Category(category);
            await newCategory.save();
            return newCategory;
        },
        updateCategory: async (_, args) => {
            const { id, category } = args;
            await Category.updateOne(
                { _id: id },
                category
            );
            const newCategory = await Category.findOne({
                _id: id, deleted: false
            });
            return newCategory;
        },
        deleteCategoery: async (_, args) => {
            const { id } = args;
            await Category.updateOne(
                { _id: id, deleted: false },
                {
                    deleted: true,
                    deletedAt: new Date()
                },
            );
            return " Da xoa";
        }
    }

};