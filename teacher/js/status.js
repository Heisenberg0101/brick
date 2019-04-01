console.log("hello")
Vue.component("currentStatus", {
    props: ["content", "index"],
    template: ` <div class="class-div2">
                   <span class="class-span0">{{content}}</span>
               </div> `,

})
new Vue ({
    el: ".class-div1",
    data: {
        // statuss: ["在办公室", "上课中", "会议中", "待客中", "忙碌中", "外出中"],
    }
})
