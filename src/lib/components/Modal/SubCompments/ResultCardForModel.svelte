<script lang="ts">
	import { ThumbsUp, Download } from 'lucide-svelte'
	import type { DatasetInfo, ModelInfo } from '$lib/server/helpers/apiTypes'
	export let info: DatasetInfo | ModelInfo
	export let inputfeatures: any
	const { author, repoId, outputFeatures, downloads, likes, createdAt } = info
	import { getModalStore } from '@skeletonlabs/skeleton'
	import { nodes, graphId } from '$stores/graph'
	import { trpc } from '$lib/trpc/client'

	const modalStore = getModalStore()

	export let nodeId: string
	export let nodeType: 'datasetNode'

	//handleSelect
	const addModel = async () => {
		let position = $nodes.filter((node) => {
			return node.id === nodeId
		})[0].position

		console.log(info)

		let insertedNode = await trpc().nodes.newModelNode.mutate({
			position: position,
			modelInfo: info,
			graphId: $graphId
		})

		$nodes.splice($nodes.length - 1, 1, insertedNode)

		$nodes = $nodes
		// Further code using insertedNode...
		modalStore.close()
	}
</script>

<div class="wrapper">
	<section class="flex gap-2 justify-between items-center h-fit py-2">
		<aside class="overflow-hidden flex-1">
			<h1 class="truncate">{repoId}</h1>
			<p class="opacity-30 flex-auto">by {author ? author : 'unknown'}</p>
		</aside>

		<button
			on:click={addModel}
			class="btn-md variant-outline rounded-md border-2 border-blue-500 h-12 w-40"
		>
			Add Model
		</button>
	</section>
	<section>
		<p class="labels">
			{'Inputs:'}
		</p>
		{#each outputFeatures as feature}
			<p class="blocks">
				{feature.label}
			</p>
		{/each}
	</section>
	<section>
		<p class="labels">
			{'Outputs:'}
		</p>
		{#each inputfeatures as feature}
			<p class="blocks">
				{feature.label}
			</p>
		{/each}
	</section>

	<!-- stats -->
	<section class="flex justify-between opacity-30 py-2">
		<aside class="flex justify-normal items-center gap-1">
			<ThumbsUp size={20} />
			{likes}
		</aside>
		<aside class="flex justify-center items-center gap-1">
			<Download size={20} />
			{downloads}
		</aside>
	</section>
</div>

<style>
	.wrapper {
		@apply w-full h-52 bg-slate-200 px-5 py-2 rounded-md flex flex-col justify-between;
	}

	.blocks {
		@apply p-3 bg-slate-100 rounded-lg flex justify-center items-center text-sm;
	}
	section {
		@apply flex gap-2 text-sm overflow-x-auto overflow-hidden py-2;
	}
	.labels {
		@apply p-3 bg-transparent w-24  rounded-lg flex justify-center items-center text-sm;
	}
</style>
