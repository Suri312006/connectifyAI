<script lang="ts">
	import { Handle, Position, type Connection } from '@xyflow/svelte'
	import { nodes } from '$routes/proc/canvas-test/Dataset'
	import { trpc } from '$lib/trpc/client'
	import { graphId } from '$stores/graph'

	export let feature: Feature
	export let relativePos: number
	export let featureType: 'Input' | 'Output'

	let { label, dtype, isSelected } = feature

	const toggleFeature = (e: Connection[]) => {
		isSelected = !isSelected
		const c = e[0]
		console.log('toggleFeature', c)
		$nodes.forEach((node) => {
			if (node.id === c.source) {
				;(node.data.outFeatures as Feature[]).forEach((f: Feature) => {
					if (f.label == c.sourceHandle) {
						f.isSelected = isSelected
					}
				})
			}
		})
	}

	const addEdgeToDb = async (e: Connection[]) => {
		const c = e[0]
		let sourceFeatureId: string = ''
		let targetFeatureId: string = ''

		$nodes.forEach((node) => {
			if (node.id === c.source) {
				;(node.data.outFeatures as Feature[]).forEach((f: Feature) => {
					console.log('looking at ', f)
					if (f.label === c.sourceHandle) {
						console.log('Found!!', f)
						sourceFeatureId = f.id!
					}
				})
			}
			if (node.id === c.target) {
				;(node.data.outFeatures as Feature[]).forEach((f: Feature) => {
					if (f.label === c.targetHandle) {
						targetFeatureId = f.id!
					}
				})
			}
		})

		let x = await trpc().edges.newEdge.mutate({
			graphId: $graphId,
			sourceNodeId: c.source,
			targetNodeId: c.target,
			targetFeatureId,
			sourceFeatureId
		})
		console.log(x)
	}
	const delEdgeFromDb = async (e: Connection[]) => {}
</script>

<aside
	class="my-2
	{isSelected ? 'bg-[#30a0ef]' : 'bg-[#d1eafb]'}"
>
	<h1>{label}</h1>
	<p class="text-sm text-left opacity-70">{dtype} • etc</p>
</aside>

<Handle
	id={label}
	type={featureType == 'Input' ? 'target' : 'source'}
	position={featureType == 'Input' ? Position.Left : Position.Right}
	style="top: {relativePos}%; background: {isSelected
		? '#30a0ef'
		: '#d1eafb'}; width: 16px; height: 16px; border: 2px solid black"
	onconnect={(e) => {
		toggleFeature(e)
		console.log('ran')
		addEdgeToDb(e)
	}}
	ondisconnect={(e) => toggleFeature(e)}
/>

<style>
	aside {
		@apply flex-col border rounded-md border-[#bbb] items-start p-4;
	}
</style>
