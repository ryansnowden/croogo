<?php $this->Html->script(array('/taxonomy/js/terms'), false); ?>
<?php $this->extend('/Common/admin_edit'); ?>
<?php
	echo $this->Form->create('Term', array(
		'url' => array(
			'controller' => 'terms',
			'action' => 'add',
			$vocabulary['Vocabulary']['id'],
		),
	));
?>
<fieldset>
	<div class="tabs">
		<ul>
			<li><span><a href="#term-basic"><?php echo __('Term'); ?></a></span></li>
			<?php echo $this->Croogo->adminTabs(); ?>
		</ul>

		<div id="term-basic">
		<?php
			echo $this->Form->input('Taxonomy.parent_id', array(
				'options' => $parentTree,
				'empty' => true,
			));
			echo $this->Form->input('title');
			echo $this->Form->input('slug', array('class' => 'slug'));
			echo $this->Form->input('description');
		?>
		</div>
		<?php echo $this->Croogo->adminTabs(); ?>
	</div>
</fieldset>

<div class="buttons">
<?php
	echo $this->Form->end(__('Save'));
	echo $this->Html->link(__('Cancel'), array(
		'action' => 'index',
		$vocabularyId,
	), array(
		'class' => 'cancel',
	));
?>
</div>