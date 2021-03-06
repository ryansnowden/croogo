<?php

App::uses('Controller', 'Controller');
App::uses('CroogoTestCase', 'TestSuite');
App::uses('AclExtras', 'Acl.Lib');

class AclExtrasTest extends CroogoTestCase {

	protected $_coreControllers = array(
		);

	protected $_extensionsControllers = array(
		'ExtensionsLocalesController',
		'ExtensionsPluginsController',
		'ExtensionsThemesController',
		);

	public function setUp() {
		$this->AclExtras = new AclExtras();
		$this->AclExtras->startup();
		$this->AclExtras->Aco->deleteAll('1 = 1');
	}

	public function tearDown() {
		$this->AclExtras->Aco->deleteAll('1 = 1');
	}

	public function testListControllers() {
		$controllers = $this->AclExtras->getControllerList();

		$this->assertFalse(in_array('CakeError', $controllers));

		$result = array_intersect($this->_coreControllers, $controllers);
		$this->assertEquals($this->_coreControllers, $result);

		$controllers = $this->AclExtras->getControllerList('Extensions');
		$result = array_intersect($this->_extensionsControllers, $controllers);
		$this->assertEquals($this->_extensionsControllers, $result);
	}

	public function testListActions() {
		$expected = array(
			'admin_index', 'admin_create', 'admin_add', 'admin_edit',
			'admin_update_paths', 'admin_delete', 'admin_add_meta',
			'admin_delete_meta', 'admin_process', 'index', 'term', 'promoted',
			'search', 'view',
			);

		$this->AclExtras->aco_sync(array('plugin' => 'Nodes'));

		$node = $this->AclExtras->Aco->node('controllers/Nodes/Nodes');
		$result = $this->AclExtras->Aco->children($node[0]['Aco']['id'], true);
		$result = Hash::extract($result, '{n}.Aco.alias');
		sort($result);
		sort($expected);
		$this->assertEquals($expected, $result);
	}

}
