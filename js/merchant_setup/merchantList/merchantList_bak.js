layui.use(['form', 'layer', "jquery", "upload", "laydate", 'laytpl', 'laypage' ], function () {
	var form = layui.form,
		$ = layui.jquery,
		upload = layui.upload,
		laydate = layui.laydate,
		laytpl = layui.laytpl,
		laypage = layui.laypage,
		layer = parent.layer === undefined ? layui.layer : top.layer
	var lastTimeData
  var searchList = [
		{
			placeholder: '输入手机号查找',
			dataType: 'phone'
		},
		{
			placeholder: '输入手机号查找',
			dataType: 'phone'
		},
		{
			placeholder: '输入手机号查找',
			dataType: 'phone'
		},
		{
			placeholder: '输入手机号查找',
			dataType: 'phone'
		}
	]
  var getTpl = $ ( '#searchTpl' ).html ()
	laytpl ( getTpl ).render ( searchList, function ( html ) {
	  $ ( '#search' ).html ( html )
	})

	var btn = [
		{
			title: '新增',
			dataType: 'add'
		},
		{
			title: '导出',
			dataType: 'export'
		},
		{
			title: '启用/禁用',
			dataType: 'use&unuse'
		},
		{
			title: '删除',
			dataType: 'delete'
		},
		{
			title: '查询',
			dataType: 'search'
		},
		{
			title: '重置',
			dataType: 'reset'
		}
	]
  var getTpl = $ ( '#btnListTpl' ).html ()
	laytpl ( getTpl ).render ( btn, function ( html ) {
	  $ ( '#btnList' ).html ( html )
	})
	$ ( '.event-btn' ).click ( function () {
		switch ( $ ( this ).attr ( 'data-type' ) ) {
			case 'add':
					fn_layerPop({
						url: '../../../html/merchant_setup/merchantList/merchantListAdd.html',
						data: {},
						title: '新增商家'
					})
				break;
			case 'use&unuse':
					break;
			default:
				break;
		}
	});

	function fn_layerPop( argv ) {
		var obj_window, str_name
		var index = layui.layer.open ({
			title: argv.title,
			type: 2,
			content: argv.url,
			success: function(layero, index){
				str_name = layero.find('iframe')[0]['name']
				obj_window = $ ( layero[0] ).find ( 'iframe' ).get ( 0 ).contentWindow 
				console.log ( obj_window )
        var body = obj_window.document.body
				// obj_body = $ ( layero ).find ( 'iframe' )[0].contentWindow.document.body
		  }
		})
		layui.layer.full ( index )
		$ ( window ).on ( 'resize', function () {
			layui.layer.full ( index )
		})
    var body = layui.layer.getChildFrame('body', index)
    return {
    	body: body,
    	name: str_name,
    	window: obj_window
    }
		// $.ajax ({
		// 	url: argv.url,
		// 	type: 'get',
		// 	dataType: 'text',
		// 	success ( txt ) {
		// 		var index = layui.layer.open ({
		// 			title: argv.title,
		// 			type: 2,
		// 			content: argv.url
		// 		});
		// 		// laytpl ( txt ).render ( argv.data, function ( html ) {
		// 		// 	var index = layui.layer.open ({
		// 		// 		title: argv.title,	
		// 		// 		type: 2,
		// 		// 		content: html
		// 		// 	})
		// 		// 	layui.layer.full ( index )
		// 		// })
		// 	}
		// })
	}

	fn_page({ status: 'init', cur: 1 });

  function fn_page( argv ) {
	  var data = {
	      pageSize: 10,
	      pageNum: argv.cur
	  }
	  var param = {
      jquery: $,
      layer: layer,
      url: 'get/shopsys/merchant/shop/select',
      type: 'post'
	  }
  	ajaxJS( param, data, function ( d ) {
  		lastTimeData = d;
			var tableTitle = [
				{
					title: '商家LOGO'
				},
				{
					title: '名称'
				},
				{
					title: '商家管理员'
				},
				{
					title: '联系电话'
				},
				{
					title: '状态'
				},
				{
					title: '创建时间'
				},
				{
					title: '商家介绍'
				},
				{
					title: '操作'
				},
			]
			d.tableTitle = tableTitle

			for ( var i = 0, len = d.data.list.length; i < len; i ++ ) {
				d.data.list[i].logo = interfaceUrl + d.data.list[i].logo
			}
			var getTpl = $ ( '#tableTpl' ).html ()
			laytpl ( getTpl ).render ( d, function ( html ) {
			  $ ( '#table' ).html ( html )
			})

			//绑定按钮事件
			//删除商家
			$ ( '.event_delete' ).click ( function () {

			})
			//修改商家
			$ ( '.event_modify' ).click ( function () {
				var _this = this;
				// var obj = fn_layerPop({
				// 	url: '../../../html/merchant_setup/merchantList/merchantListAdd.html',
				// 	data: {},
				// 	title: '新增商家'
				// })
				// var index = $ ( _this ).attr ( 'data-index' )
				// var data = lastTimeData.data.list[index]
				// console.log ( obj.window )
				// $ ( obj.window.document.body ).find ( '.event_shopName' ).val ( data.name )
				// $ ( obj.body ).find ( '.event_admin' ).val ( data.admin )
				// $ ( obj.body ).find ( '.event_phone' ).val ( data.phone )
				// $ ( obj.body ).find ( '.event_address' ).val ( data.address )
				// $ ( obj.body ).find ( '.event_create' ).val ( data.createName )
				// $ ( obj.body ).find ( '.event_createTime' ).val ( data.createTime )
				// $ ( obj.body ).find ( '.event_module' ).val ( data )


				var index = layui.layer.open ({
					title: '修改商家',
					type: 2,
					content: '../../../html/merchant_setup/merchantList/merchantListAdd.html',
					success: function(layero, index){
						var obj_window = $ ( layero[0] ).find ( 'iframe' ).get ( 0 ).contentWindow 
		        var body = obj_window.document.body
						var index = $ ( _this ).attr ( 'data-index' )
						var data = lastTimeData.data.list[index]
						$ ( body ).find ( '.event_shopName' ).val ( data.name )
						$ ( body ).find ( '.event_admin' ).val ( data.admin )
						$ ( body ).find ( '.event_phone' ).val ( data.phone )
						$ ( body ).find ( '.event_address' ).val ( data.address )
						$ ( body ).find ( '.event_create' ).val ( data.createName )
						$ ( body ).find ( '.event_createTime' ).val ( data.createTime )
						$ ( body ).find ( '.event_introduce' ).val ( data.introduce )
				  }
				})
				layui.layer.full ( index )
				$ ( window ).on ( 'resize', function () {
					layui.layer.full ( index )
				})
			})
			//查看商家
			$ ( '.event-details' ).click ( function () {
				var _this = this;
				$.ajax ({
					url: '../../../html/merchant_setup/merchantList/merchantListDetails.html',
					type: 'get',
					dataType: 'text',
					success ( txt ) {
						laytpl ( txt ).render ( d.data.list[ $ ( _this ).attr ( 'data-index' ) ], function ( html ) {
							var index = layui.layer.open ({
								title: '查看商家',	
								type: 1,
								content: html
							})
							layui.layer.full ( index )
						})
					}
				})
			})

			//初始化分页插件
			if ( argv.status == 'init' ) {
				var plug_layerPage = laypage.render({
					elem: 'page',
					count: d.data.total,
					limit: 10,
					jump ( obj ) {
						fn_page({ cur: obj.curr })
					}
				})
			}
		})
  }
})