/**
 * AclPermissions
 *
 * for AclPermissionsController (acl plugin)
 */
var AclPermissions = {};

// row/cell templates
AclPermissions.templates = {

	permissionRow: _.template('<tr data-parent_id="<%= id %>" class="<%= classes %>"> <%= text %> </tr>'),


	controllerCell: _.template('\
<td> \
	<div class="<%= classes %>" data-alias="<%= alias %>" \
		data-level="<%= level %>" data-id="<%= id %>" > \
	<%= alias %> \
	</div> \
</td>'),

	toggleButton: _.template('\
<td><img src="<%= Croogo.basePath %>img/icons/<%= icon %>" class="<%= classes.trim() %>" \
		data-aro_id="<%= aroId %>" data-aco_id="<%= acoId %>"> \
</td>'),

	editLinks: _.template('<td> <%= edit %> <%= del %> <%= up %> <%= down %> </td>')

};

/**
 * functions to execute when document is ready
 *
 * @return void
 */
AclPermissions.documentReady = function() {
	AclPermissions.permissionToggle();
	AclPermissions.tableToggle();
	$('tr:has(div.controller)').addClass('controller-row');
};

/**
 * Toggle permissions (enable/disable)
 *
 * @return void
 */
AclPermissions.permissionToggle = function() {
	$('.permission-table').one('click', '.permission-toggle', function() {
		var $this = $(this);
		var acoId = $this.data('aco_id');
		var aroId = $this.data('aro_id');

		// show loader
		$this.attr('src', Croogo.basePath+'img/ajax/circle_ball.gif');

		// prepare loadUrl
		var loadUrl = Croogo.basePath+'admin/acl/acl_permissions/toggle/';
		loadUrl    += acoId+'/'+aroId+'/';

		// now load it
		var target = $this.parent();
		$.post(loadUrl, null, function(data, textStatus, jqXHR) {
			target.html(data);
			AclPermissions.permissionToggle();
		});

		return false;
	});
};

/**
 * Toggle table rows (collapsible)
 *
 * @return void
 */
AclPermissions.tableToggle = function() {

	// create table rows from json
	var renderPermissions = function(data, textStatus) {
		var $el = $(this);
		var rows = '';
		var id = $el.data('id');
		for (var acoId in data.permissions) {
			text = '<td>' + acoId + '</td>';
			var aliases = data.permissions[acoId];
			for (var alias in aliases) {
				var aco = aliases[alias];
				var children = aco['children'];
				var classes = children > 0 ? 'controller expand' : '';
				classes += " level-" + data.level;
				text += AclPermissions.templates.controllerCell({
					id: acoId,
					alias: alias,
					level: data.level,
					classes: classes.trim()
				});
				if (Croogo.params.controller == 'acl_permissions') {
					text += renderRoles(data.aros, acoId, aco);
				} else {
					text += AclPermissions.templates.editLinks(aco['url']);
				}
			}
			var rowClass = '';
			if (children > 0 && data.level > 0) {
				rowClass = "controller-row level-" + data.level;
			}
			rows += AclPermissions.templates.permissionRow({
				id: id,
				classes: rowClass,
				text: text
			});
		}
		var $row = $el.parents('tr');
		$(rows).insertAfter($row);
		$el.removeClass('loading');
	};

	// create table cells for role permissions
	var renderRoles = function(aros, acoId, roles) {
		var text = '';
		for (var aroIndex in roles['roles']) {
			var cell = {
				aroId: aros[aroIndex],
				acoId: acoId,
				classes: "permission-toggle"
			};
			if (roles['children'] > 0) {
				text += '<td>&nbsp;</td>';
				continue;
			}

			var allowed = roles['roles'][aroIndex];
			if (aroIndex == 1) {
				cell.icon = "tick_disabled.png";
				cell.classes = " permission-disabled";
			} else {
				if (allowed) {
					cell.icon = "tick.png";
				} else {
					cell.icon = "cross.png";
				}
			}
			text += AclPermissions.templates.toggleButton(cell);
		}
		return text;
	};

	$('.permission-table').on('click', '.controller', function() {
		var $el = $(this);
		var id = $el.data('id');
		var level = $el.data('level');

		$el.addClass('loading');
		if ($el.hasClass('expand')) {
			$el.removeClass('expand').addClass('collapse');
		} else {
			var children = $('tr[data-parent_id=' + id + ']');
			children.each(function() {
				var childId = $('.controller', this).data('id')
				$('tr[data-parent_id=' + childId + ']').remove();
			}).remove();
			$el.removeClass('loading collapse').addClass('expand');
			return;
		}

		var params = {
			perms: true
		};
		if (Croogo.params.controller == 'acl_actions') {
			params = $.extend(params, {
				urls: true,
				perms: false
			});
		}

		var url = Croogo.basePath + 'admin/acl/acl_permissions/index/';
		$.getJSON(url + id + '/' + level, params, function(data, textStatus) {
			renderPermissions.call($el[0], data, textStatus);
		});
	});
};

/**
 * document ready
 *
 * @return void
 */
$(document).ready(function() {
	if (Croogo.params.controller == 'acl_permissions') {
		AclPermissions.documentReady();
	}
});