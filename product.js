import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';

const site='https://vue3-course-api.hexschool.io/v2/';
const path='amberlin';

let productModal={};
let delProductModal={};

//確認登入者的身分

const app=createApp({
    data(){
        return{
            products:[],
            newProduct:{
                imagesUrl:[],
            },
            isNew:false,
        }
    },
    methods:{
        checkLogin(){
            //MDN document.cookies
            const token=document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            //取出token後,帶入axios headers
            axios.defaults.headers.common['Authorization'] =token;
            //預設: 驗證登入狀態
            const url=`${site}api/user/check`;
            axios.post(url)
            .then((res)=>{
                console.log(res);
                this.getProduct();
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        getProduct(){
            const url=`${site}api/${path}/admin/products/all`;
            axios.get(url)
            .then(res=>{
                console.log(res);
                this.products=res.data.products;
            })
            .catch(err=>{
                console.log(err);
            })
        },
        modalProduct( status, product){ //區分modal 是新增產品 or 編輯產品(同時帶入產品資料)
            //console.log(status, product);
            if(status==='isNew'){
                this.newProduct={
                    imagesUrl:[],
                },
                productModal.show();
                this.isNew=true;
            } else if(status==='edit'){
                
                this.newProduct={ ...product }; //因為物件傳參考的特性,若不用"拷貝"的方式,即使編輯的產品未儲存,產品列表的資料還是會被更動
                productModal.show();
                this.isNew=false;
            } else if(status==='delete'){
                delProductModal.show();
                this.newProduct={ ...product };
                
            }
            
        },
        updateProduct(){
            let url=`${site}api/${path}/admin/product`;
            let method='post';
            if(!this.isNew){
                url=`${site}api/${path}/admin/product/${this.newProduct.id}`;
                method='put';
            }
            axios[method](url, { data:this.newProduct }) //使用[]帶入變數、要注意post的資料格式
            .then(res=>{
                console.log(res);
                this.getProduct();
                productModal.hide();
            })
            .catch(err=>{
                console.log(err);
            })
        },
        delProduct(){
            let url=`${site}api/${path}/admin/product/${this.newProduct.id}`;
            axios.delete(url)
            .then(res=>{
                console.log(res);
                this.getProduct();
                delProductModal.hide();
            })
        }
    },
    mounted(){
        this.checkLogin();
        productModal= new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal= new bootstrap.Modal(document.getElementById('delProductModal'));
    }
});
app.mount('#app');
