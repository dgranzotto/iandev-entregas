(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["e3417abc"],{"26a2":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("q-page",{staticClass:"row justify-center",attrs:{padding:""}},[a("div",{staticStyle:{width:"500px","max-width":"90vw"}},[a("div",{staticClass:"q-headline"},[t._v("Entrega")]),a("q-input",{attrs:{readonly:""},model:{value:t.$store.state.app.entregaAtual.descricao,callback:function(e){t.$set(t.$store.state.app.entregaAtual,"descricao",e)},expression:"$store.state.app.entregaAtual.descricao"}}),a("q-input",{attrs:{readonly:""},model:{value:t.$store.state.app.entregaAtual.subdescricao,callback:function(e){t.$set(t.$store.state.app.entregaAtual,"subdescricao",e)},expression:"$store.state.app.entregaAtual.subdescricao"}}),a("q-item-separator"),a("q-select",{attrs:{"float-label":"Selecione o tipo da ocorrência",options:t.$store.state.app.motivosRetorno},model:{value:t.motivoRetorno,callback:function(e){t.motivoRetorno=e},expression:"motivoRetorno"}}),t.$store.state.app.entregaAtual.address||t.$store.state.app.entregaAtual.latitudeentrega&&t.$store.state.app.entregaAtual.longitudeentrega?a("q-btn",{staticClass:"full-width q-my-md",attrs:{rounded:"",color:"primary",icon:"directions",label:"Visualizar Rota",size:"md"},on:{click:t.visualizarRota}}):t._e(),a("q-item-separator"),a("q-list",{staticClass:"q-mt-md dark-example",attrs:{"no-border":"",striped:""}},[a("div",{staticClass:"q-headline"},[t._v("Itens")]),t._l(t.$store.state.app.entregaAtual.itens,function(e,o){return a("q-item",{key:o,nativeOn:{click:function(a){t.entregas(e)}}},[a("q-item-main",[a("q-item-tile",{attrs:{label:""}},[t._v(t._s(e.descricao))]),a("q-item-tile",{attrs:{sublabel:""}},[t._v("Quantidade: "+t._s(e.quantidade))]),a("q-item-tile",{directives:[{name:"show",rawName:"v-show",value:"S"==e.requerfoto,expression:"item.requerfoto == 'S'"}],attrs:{label:"",color:"negative"}},[t._v("Necessário tirar foto")])],1),a("q-item-side",[a("q-btn",{attrs:{round:"",color:"primary",icon:"photo_camera"},nativeOn:{click:function(a){t.tirarFoto(e)}}})],1)],1)})],2)],1)])},i=[];o._withStripped=!0;var r={name:"PageEntrega",data:function(){return{motivoRetorno:null}},methods:{entregas:function(){},tirarFoto:function(t){this.$uiUtil.gotoPage(this,"midias")},visualizarRota:function(){this.$uiUtil.gotoPage(this,"entregarota")}}},s=r,n=(a("d316"),a("a6c2")),l=Object(n["a"])(s,o,i,!1,null,null,null);l.options.__file="Entrega.vue";e["default"]=l.exports},"30b6":function(t,e,a){var o=a("a811");"string"===typeof o&&(o=[[t.i,o,""]]),o.locals&&(t.exports=o.locals);var i=a("b454").default;i("1d7e022d",o,!1,{sourceMap:!1})},a811:function(t,e,a){e=t.exports=a("7b4b")(!1),e.push([t.i,"",""])},d316:function(t,e,a){"use strict";var o=a("30b6"),i=a.n(o);i.a}}]);