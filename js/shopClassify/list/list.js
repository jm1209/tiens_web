layui.use(['form', 'layer', "jquery", "upload", "laydate", 'laytpl', 'laypage' ], function () {
	var form = layui.form,
		$ = layui.jquery,
		upload = layui.upload,
		laydate = layui.laydate,
		laytpl = layui.laytpl,
		laypage = layui.laypage,
		layer = parent.layer === undefined ? layui.layer : top.layer

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
			dataType: 'use/unuse'
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
		console.log ($ ( this ).attr ( 'data-type' ))
		switch ( $ ( this ).attr ( 'data-type' ) ) {
			case 'add':
					fn_layerPop({
						url: '../../../html/merchant_setup/merchantList/merchantListAdd.html',
						data: {},
						title: ADD || '新增商家'
					})
				break;
			default:
				break;
		}
	});

	function fn_layerPop( argv ) {
		var index = layui.layer.open ({
			title: argv.title,
			type: 2,
			content: argv.url
		})
		layui.layer.full ( index )
		$ ( window ).on ( 'resize', function () {
			layui.layer.full ( index )
		})
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
      url: 'get/shopsys/merchant/goods/select',
      type: 'post'
	  }
  	ajaxJS( param, data, function ( d ) {
			var tableTitle = [
				{
					title: SHOPLOGO || '商家LOGO'
				},
				{
					title: NAME || '名称'
				},
				{
					title: SHOPMANAGER || '商家管理员'
				},
				{
					title: PHONE || '联系电话'
				},
				{
					title: STATE || '状态'
				},
				{
					title: CREATETIME || '创建时间'
				},
				{
					title: DESCRIPTION || '商家介绍'
				},
				{
					title: HANDLETYPE || '操作'
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
								title: SEE || '查看商家',
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