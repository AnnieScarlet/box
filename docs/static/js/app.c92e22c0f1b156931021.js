webpackJsonp([1],{Crn9:function(t,e){},Dtn4:function(t,e){},"I+XV":function(t,e){},NHnr:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("7+uW"),r=n("Dd8w"),a=n.n(r),s=n("NYxO"),u={name:"media-view",computed:a()({},Object(s.c)("MediaView",{media_view_data:"media_view_data"}),Object(s.b)("MediaView",{media_url:"getMediaUrl"}))},l={render:function(){var t=this.$createElement,e=this._self._c||t;return this.media_view_data?e("div",{attrs:{id:"media-view"}},[this._v("\n\tMedia "+this._s(this.media_view_data)+"\n\t"),e("img",{attrs:{src:this.media_url}})]):this._e()},staticRenderFns:[]},o={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("header",{attrs:{id:"app-header"}},[t._v("\n\tHeader\n\t"),n("nav",[n("router-link",{attrs:{to:"/"}},[t._v("Home")]),t._v(" "),n("router-link",{attrs:{to:"/upload"}},[t._v("Upload")]),t._v(" "),n("router-link",{attrs:{to:"/album"}},[t._v("Album")]),t._v(" "),n("router-link",{attrs:{to:"/settings"}},[t._v("Settings")]),t._v(" "),n("router-link",{attrs:{to:"/signin"}},[t._v("Signin")]),t._v(" "),n("router-link",{attrs:{to:"/signup"}},[t._v("Signup")])],1)])},staticRenderFns:[]},d={render:function(){var t=this.$createElement;return(this._self._c||t)("footer",{attrs:{id:"footer"}},[this._v("\n\tFooter\n")])},staticRenderFns:[]},_={name:"app",components:{MediaView:n("VU/8")(u,l,!1,function(t){n("Crn9")},null,null).exports,AppHeader:n("VU/8")(null,o,!1,null,null,null).exports,AppFooter:n("VU/8")(null,d,!1,null,null,null).exports}},c={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("app-header"),this._v(" "),e("router-view"),this._v(" "),e("media-view"),this._v(" "),e("app-footer")],1)},staticRenderFns:[]},p=n("VU/8")(_,c,!1,function(t){n("Dtn4")},null,null).exports,m=n("/ocq"),v="https://s3-ap-northeast-1.amazonaws.com/eorzeabox-dev/photo/",h=["ffxiv_20171126_152637","ffxiv_20171126_152841","ffxiv_20171126_153353","ffxiv_20171126_153556","ffxiv_20171126_153716","ffxiv_20171126_153716_","ffxiv_20171126_153824","ffxiv_20171126_154146","ffxiv_20171126_154618","ffxiv_20171126_155042","ffxiv_20171126_155049","ffxiv_20171128_012111","ffxiv_20171129_000925","ffxiv_20171129_001104"],f={name:"index",data:function(){return{media_list:[]}},methods:{getThumbnailUrl:function(t){return v+t.id+".png"},selectMedia:function(t){this.$router.push({name:"index-view",params:{type:"photo",id:t.id}}),this.$store.commit("MediaView/setData",t)}},mounted:function(){"index-view"===this.$route.name&&this.$store.commit("MediaView/setData",{id:this.$route.params.id});var t=[];h.forEach(function(e){return t.push({id:e})}),this.media_list=t}},x={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"index"}},[t._v("\n\tIndex "),n("br"),t._v("\n\troute name: "+t._s(t.$route.name)),n("br"),t._v("\n\troute path: "+t._s(t.$route.path)),n("br"),t._v("\n\troute params: "+t._s(t.$route.params[0])),n("br"),t._v(" "),t._l(t.media_list,function(e){return n("div",{staticClass:"thumb",on:{click:function(n){t.selectMedia(e)}}},[n("img",{attrs:{src:t.getThumbnailUrl(e)}})])}),t._v(" "),n("div",{staticClass:"clear"})],2)},staticRenderFns:[]},g=n("VU/8")(f,x,!1,function(t){n("I+XV")},null,null).exports,w={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"album"}},[this._v("\n\tAlbum "+this._s(this.$route.params[0])+"\n")])},staticRenderFns:[]},$=n("VU/8")(null,w,!1,null,null,null).exports,b={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"upload"}},[this._v("\n\tUpload\n")])},staticRenderFns:[]},V=n("VU/8")(null,b,!1,null,null,null).exports,U={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"user"}},[this._v("\n\tUser  "+this._s(this.$route.params.id)+"\n")])},staticRenderFns:[]},F=n("VU/8")(null,U,!1,null,null,null).exports,E={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"settings"}},[this._v("\n\tSettings\n")])},staticRenderFns:[]},M=n("VU/8")(null,E,!1,null,null,null).exports,R={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"signin"}},[this._v("\n\tSignin\n")])},staticRenderFns:[]},k=n("VU/8")(null,R,!1,null,null,null).exports,A={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{attrs:{id:"signup"}},[this._v("\n\tSignup\n")])},staticRenderFns:[]},S=n("VU/8")(null,A,!1,null,null,null).exports;i.a.use(m.a);var D=new m.a({routes:[{path:"/",name:"index",component:g},{path:"/-/(.*)",name:"index-search",component:g},{path:"/media/:type/:id",name:"index-view",component:g},{path:"/album/(.*)?",name:"album`",component:$},{path:"/user/:id",name:"user`",component:F},{path:"/upload",name:"upload`",component:V,meta:{requiresAuth:!0}},{path:"/settings",name:"settings`",component:M,meta:{requiresAuth:!0}},{path:"/signin",name:"signin`",component:k},{path:"/signup",name:"signup`",component:S},{path:"*",redirect:{path:"/"}}]});i.a.use(s.a);var H={namespaced:!0,state:{media_view_data:null},mutations:{setData:function(t,e){t.media_view_data=e}},getters:{getMediaUrl:function(t){return v+t.media_view_data.id+".png"}}},C=new s.a.Store({modules:{MediaView:H}});i.a.config.productionTip=!1,new i.a({el:"#app",router:D,store:C,template:"<App/>",components:{App:p}})}},["NHnr"]);
//# sourceMappingURL=app.c92e22c0f1b156931021.js.map