"use strict";(self["webpackChunkvue3_ecommerce"]=self["webpackChunkvue3_ecommerce"]||[]).push([[143],{2143:function(e,l,a){a.r(l),a.d(l,{default:function(){return h}});var u=a(641),s=a(33),t=a(3751),o=a(953),r=a(7215);const n={class:"profile-view"},d={key:0,class:"alert success"},i={class:"profile-content"},m={class:"user-info"},p={class:"form-group"},c={class:"form-group"},v={class:"form-group"},f={class:"form-group"};var k={__name:"ProfileView",setup(e){const l=(0,r.Pj)(),a=(0,o.KR)({fullName:"",email:"",phone:"",address:""}),k=(0,u.EW)((()=>l.getters["user/getUpdateStatus"])),L=async()=>{try{await l.dispatch("user/updateUser",a.value),setTimeout((()=>{l.commit("user/SET_UPDATE_STATUS",null)}),3e3)}catch(e){console.error("Update failed:",e)}};return(0,u.sV)((()=>{const e=l.getters["auth/currentUser"];a.value={fullName:e.fullName||"",email:e.email||"",phone:e.phone||"",address:e.address||""}})),(e,l)=>((0,u.uX)(),(0,u.CE)("div",n,[l[10]||(l[10]=(0,u.Lk)("h1",null,"My Profile",-1)),k.value?((0,u.uX)(),(0,u.CE)("div",d,(0,s.v_)(k.value),1)):(0,u.Q3)("",!0),(0,u.Lk)("div",i,[(0,u.Lk)("div",m,[l[9]||(l[9]=(0,u.Lk)("h2",null,"Personal Information",-1)),(0,u.Lk)("form",{onSubmit:(0,t.D$)(L,["prevent"])},[(0,u.Lk)("div",p,[l[4]||(l[4]=(0,u.Lk)("label",null,"Full Name",-1)),(0,u.bo)((0,u.Lk)("input",{type:"text","onUpdate:modelValue":l[0]||(l[0]=e=>a.value.fullName=e),required:""},null,512),[[t.Jo,a.value.fullName]])]),(0,u.Lk)("div",c,[l[5]||(l[5]=(0,u.Lk)("label",null,"Email",-1)),(0,u.bo)((0,u.Lk)("input",{type:"email","onUpdate:modelValue":l[1]||(l[1]=e=>a.value.email=e),disabled:""},null,512),[[t.Jo,a.value.email]])]),(0,u.Lk)("div",v,[l[6]||(l[6]=(0,u.Lk)("label",null,"Phone",-1)),(0,u.bo)((0,u.Lk)("input",{type:"tel","onUpdate:modelValue":l[2]||(l[2]=e=>a.value.phone=e)},null,512),[[t.Jo,a.value.phone]])]),(0,u.Lk)("div",f,[l[7]||(l[7]=(0,u.Lk)("label",null,"Address",-1)),(0,u.bo)((0,u.Lk)("textarea",{"onUpdate:modelValue":l[3]||(l[3]=e=>a.value.address=e)},null,512),[[t.Jo,a.value.address]])]),l[8]||(l[8]=(0,u.Lk)("button",{type:"submit"},"Update Profile",-1))],32)])])]))}},L=a(6262);const b=(0,L.A)(k,[["__scopeId","data-v-2b7b602f"]]);var h=b}}]);
//# sourceMappingURL=143.2c17a327.js.map