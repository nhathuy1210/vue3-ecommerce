"use strict";(self["webpackChunkvue3_ecommerce"]=self["webpackChunkvue3_ecommerce"]||[]).push([[951],{5951:function(e,t,a){a.r(t),a.d(t,{default:function(){return A}});var c=a(641),r=a(5220),u=a(7215),s=a(33),o=a(3751),l=a(953);const d={class:"product-detail"},i={class:"product-images"},n=["src","alt"],p={class:"product-info"},v={class:"product-meta"},k={class:"rating"},m={class:"category"},L={class:"product-price"},g={class:"product-description"},w={class:"purchase-actions"},_={class:"quantity-selector"},b=["max"],C=["disabled"],h={class:"product-reviews"},y={key:0,class:"review-form"},f={class:"rating-input"},I=["value"],E={class:"reviews-list"},R={class:"review-header"},X={class:"rating"},D={class:"date"},P={class:"comment"};var q={__name:"UserProductDetail",props:{product:{type:Object,required:!0}},setup(e){const t=e,a=(0,u.Pj)(),r=(0,l.KR)(1),q=(0,l.KR)({rating:5,comment:""}),K=(0,c.EW)((()=>a.getters["auth/isLoggedIn"])),U=()=>{r.value<t.product.stock&&r.value++},V=()=>{r.value>1&&r.value--},W=()=>{a.dispatch("cart/addItem",{id:t.product.id,name:t.product.name,price:t.product.price,image:t.product.image,quantity:r.value})},j=async()=>{q.value.comment&&(await a.dispatch("product/addReview",{productId:t.product.id,review:{...q.value,date:(new Date).toISOString()}}),q.value={rating:5,comment:""})};return(t,a)=>((0,c.uX)(),(0,c.CE)("div",d,[(0,c.Lk)("div",i,[(0,c.Lk)("img",{src:e.product.image,alt:e.product.name},null,8,n)]),(0,c.Lk)("div",p,[(0,c.Lk)("h1",null,(0,s.v_)(e.product.name),1),(0,c.Lk)("div",v,[(0,c.Lk)("div",k,[(0,c.Lk)("span",null,"Rating: "+(0,s.v_)(e.product.rating)+"/5",1),(0,c.Lk)("span",null,"("+(0,s.v_)(e.product.reviews.length)+" reviews)",1)]),(0,c.Lk)("span",m,"Category: "+(0,s.v_)(e.product.category),1)]),(0,c.Lk)("div",L,[(0,c.Lk)("h2",null,(0,s.v_)(t.formatCurrency(e.product.price)),1),(0,c.Lk)("span",{class:(0,s.C4)(["stock",{"low-stock":e.product.stock<10}])},(0,s.v_)(e.product.stock)+" items in stock ",3)]),(0,c.Lk)("div",g,[a[3]||(a[3]=(0,c.Lk)("h3",null,"Description",-1)),(0,c.Lk)("p",null,(0,s.v_)(e.product.description),1)]),(0,c.Lk)("div",w,[(0,c.Lk)("div",_,[(0,c.Lk)("button",{onClick:V},"-"),(0,c.bo)((0,c.Lk)("input",{type:"number","onUpdate:modelValue":a[0]||(a[0]=e=>r.value=e),min:"1",max:e.product.stock},null,8,b),[[o.Jo,r.value]]),(0,c.Lk)("button",{onClick:U},"+")]),(0,c.Lk)("button",{class:"add-to-cart",onClick:W,disabled:!e.product.stock}," Add to Cart ",8,C)])]),(0,c.Lk)("div",h,[a[6]||(a[6]=(0,c.Lk)("h3",null,"Customer Reviews",-1)),K.value?((0,c.uX)(),(0,c.CE)("div",y,[a[5]||(a[5]=(0,c.Lk)("h4",null,"Write a Review",-1)),(0,c.Lk)("div",f,[a[4]||(a[4]=(0,c.Lk)("span",null,"Your Rating:",-1)),(0,c.bo)((0,c.Lk)("select",{"onUpdate:modelValue":a[1]||(a[1]=e=>q.value.rating=e)},[((0,c.uX)(),(0,c.CE)(c.FK,null,(0,c.pI)(5,(e=>(0,c.Lk)("option",{key:e,value:e},(0,s.v_)(e)+" stars",9,I))),64))],512),[[o.u1,q.value.rating]])]),(0,c.bo)((0,c.Lk)("textarea",{"onUpdate:modelValue":a[2]||(a[2]=e=>q.value.comment=e),placeholder:"Write your review here..."},null,512),[[o.Jo,q.value.comment]]),(0,c.Lk)("button",{onClick:j},"Submit Review")])):(0,c.Q3)("",!0),(0,c.Lk)("div",E,[((0,c.uX)(!0),(0,c.CE)(c.FK,null,(0,c.pI)(e.product.reviews,(e=>((0,c.uX)(),(0,c.CE)("div",{key:e.userId,class:"review"},[(0,c.Lk)("div",R,[(0,c.Lk)("span",X,(0,s.v_)(e.rating)+" stars",1),(0,c.Lk)("span",D,(0,s.v_)(t.formatDate(e.date)),1)]),(0,c.Lk)("p",P,(0,s.v_)(e.comment),1)])))),128))])])]))}},K=a(6262);const U=(0,K.A)(q,[["__scopeId","data-v-56fb6eb2"]]);var V=U;const W={class:"product-detail-view"};var j={__name:"ProductDetailView",setup(e){const t=(0,r.lq)(),a=(0,u.Pj)(),s=(0,c.EW)((()=>a.getters["product/getProductById"](t.params.id)));return(e,t)=>((0,c.uX)(),(0,c.CE)("div",W,[(0,c.bF)(V,{product:s.value},null,8,["product"])]))}};const x=(0,K.A)(j,[["__scopeId","data-v-ae228856"]]);var A=x}}]);
//# sourceMappingURL=951.18585039.js.map