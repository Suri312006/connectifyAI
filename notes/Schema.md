# node

```json
{
    "node_id": string,
    "repo_id": string,
    "type": "dataset" | "model",

    // derive from getNode(node_id)
    "position": {
        x: int,
        y: int
    }

    // from repo_id, derive:
        // dataset/model name
        // output fields (+input for model)
}
```

# edge

```json
{
    "edge_id": string,
    // derive from getEdge(edge_id)
    "source_node_id": string,
    "target_node_id": string,

    // defaults:
        // type: "smoothstep"
		// animated: true,
		// style: 'stroke: #fff;'
}
```
