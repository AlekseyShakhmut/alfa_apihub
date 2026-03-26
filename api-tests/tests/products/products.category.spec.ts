import {test, expect} from "../../fixtures/auth_context";
import {generateCategory, generateProduct} from "../../utils/data_generator";
import {createProductFormData} from "../../utils/form_data_helper";

test.describe.serial("Проверка информации о товаре на основе категории, к которой он относится", () => {
    let categoryId: string;
    let categoryName: string;
    let productId: string;
    let productName: string;
    let productPrice: number;

    test.beforeAll('Создание категории и продукта', async ({request, authToken}) => {
        const categoryCreate = generateCategory();

        const responseCategory = await request.post('ecommerce/categories', {
            data: categoryCreate,
            headers: {'Authorization': `Bearer ${authToken}`}
        })
            expect(responseCategory.status()).toBe(201);
            const bodyCategory = await responseCategory.json();
            expect(bodyCategory.message).toBe('Category created successfully')
            categoryId = bodyCategory.data._id
            categoryName = bodyCategory.data.name

            const productData = generateProduct(categoryId);
            const formData = createProductFormData({
            ...productData,
            mainImage: 'main.jpg',
            subImages: ['sub1.jpeg', 'sub2.jpg', 'sub3.jpg']
        });
            const responseProduct = await request.post('ecommerce/products', {
                multipart: formData,
                headers: {'Authorization': `Bearer ${authToken}`}
            })
              expect(responseProduct.status()).toBe(201);
              const bodyProduct = await responseProduct.json();
              expect(bodyProduct.message).toBe('Product created successfully')
              productId = bodyProduct.data._id
              productName = bodyProduct.data.name
              productPrice = bodyProduct.data.price
    })
    test.afterAll('Удаление категории и продукта', async ({request, authToken}) => {
        const responseProduct = await request.delete(`ecommerce/products/${productId}`,{
            headers: {'Authorization': `Bearer ${authToken}`}
        });
        expect([200, 204]).toContain(responseProduct.status());
        const bodyProduct = await responseProduct.json();
        expect(bodyProduct.message).toBe('Product deleted successfully')

        const checkProduct = await request.get(`ecommerce/products/${productId}`);
        expect(checkProduct.status()).toBe(404);

        const responseCategory = await request.delete(`ecommerce/categories/${categoryId}`,{
            headers: {'Authorization': `Bearer ${authToken}`}
        });
        expect([200, 204]).toContain(responseCategory.status());
        const bodyCategory = await responseCategory.json();
        expect(bodyCategory.message).toBe('Category deleted successfully')

        const checkCategory = await request.get(`ecommerce/categories/${categoryId}`);
        expect(checkCategory.status()).toBe(404);
    })
    test('Проверка информации о товаре внутри категории', async ({request}) => {
        const response = await request.get(`ecommerce/products/category/${categoryId}`,{
            params: {
                page: 1,
                limit: 1
            }
        });
             expect(response.status()).toBe(200);
             const body = await response.json();

             expect(body.data.totalProducts).toBe(1);
             expect(body.data.totalPages).toBe(1);
             expect(body.data.limit).toBe(1);
             expect(body.data.page).toBe(1);
             expect(body.message).toBe('Category products fetched successfully');

             expect(body.data.products).toBeInstanceOf(Array);
             expect(body.data.products.length).toBe(1);

             expect(body.data.category._id).toBe(categoryId);
             expect(body.data.category.name).toBe(categoryName);
             expect(body.data.products[0]._id).toBe(productId);
             expect(body.data.products[0].name).toBe(productName);
             expect(body.data.products[0].price).toBe(productPrice);
    });
});