//存取localStorage中的数据
var store = {
	save(key,value){//保存
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){//获取
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
var list = store.fetch("zhifangVue");
var filter = {
				all:function(){
					return list;
				},
				finished:function(){
					return list.filter(function(item){
						return item.isChecked;
					})
				},
				unfinished:function(){
					return list.filter(function(item){
						return !item.isChecked;
					})
					
				}
			};
var vm = new Vue({
	el:".main",
	data:{
		list:list,
		todo:"",
		editorTodos:"", //记录正在编辑的数据
		beforeTitle:"", //记录正在编辑数据的title
		visibility:"all", //通过此属性值的变化对数据进行筛选
		taskListChecked:"", //记录
	},
	watch:{
		// list:function(){//监控list属性，当值发生变化执行此函数
		// 	store.save("zhifangVue",this.list);
		// }
		list:{
			handler:function(){
				store.save("zhifangVue",this.list);
			},
			deep:true
		}
	},
	computed:{//计算属性
		noCheckLength:function(){
			return this.list.filter(function(item){
						return !item.isChecked
				    }).length
		},
		filteredList:function(){//过滤list all finished unfinished
			
			return filter[this.visibility] ? filter[this.visibility](list) : list;
			
		}
	},
	methods:{
		//添加任务
		addTodo(){
			//向list中添加任务
			console.log("触发按键");
			this.list.push({
				title:this.todo,
				isChecked:false
			});
			this.todo = "";
		},
		//删除任务
		deleteTodo(curitem){
			var index = this.list.indexOf(curitem);
			this.list.splice(index,1);
		},
		//编辑任务 记录编辑任务的title以便取消的时候赋值
		editorTodo(curitem){
			this.beforeTitle = curitem.title;
			this.editorTodos = curitem;
			console.log(this.editorTodos);
		},
		//编辑完成后
		editorTodoend(curitem){
			this.editorTodos = "";
		},
		//取消编辑
		cacelTodo(curitem){
			console.log("取消编辑");
			curitem.title = this.beforeTitle;
			this.beforeTitle = "";
			this.editorTodos = "";
		}
	},
	directives:{//自定义指令foucs
		"focus":{
			update(el,blinding){
				if(blinding.value){
					el.focus();
				}
			}
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	console.log(hash);
	vm.visibility = hash;
}
window.addEventListener("hashchange",watchHashChange);