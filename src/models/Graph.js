import * as d3 from "d3";


export class Node {
    /** @type {(number|string)} */
    id

    /** @type {number} */
    startTime

    /** @type {number} */
    endTime

    /** @type {boolean} */
    hasParent = false

    /** @type {Node[]} */
    childNodes = []

    /** @type {Edge[]} */
    inEdges = []

    /** @type {Edge[]} */
    outEdges = []

    constructor(id, startTime, endTime) {
        this.id = id
        this.startTime = startTime
        this.endTime = endTime
    }
}

export class Edge {
    /** @type {string}*/
    id

    /** @type {Node}*/
    srcNode

    /** @type {Node}*/
    dstNode

    constructor(src, dst) {
        this.id = this.getEdgeId(src, dst)
        this.srcNode = src
        this.dstNode = dst
    }

    getEdgeId(src, dst) {
        return src.id + '-' + dst.id
    }
}

export class Graph {
    width = 1400
    padding = 100
    bar_height = 15
    greedy_canvas_height = 300
    text_height = 12
    MIN_TIME = 0
    MAX_TIME = 1e9
    color = d3.scaleOrdinal(d3.schemeCategory10)
    placed_nodes = []

    /** @type {Node[]} */
    nodes = []

    /** @type {Edge[]} */
    edges = []

    /** @type {Map<(number|string), Node>} */
    nodeMap = new Map()

    /** @type {Map<string, Edge>} */
    edgeMap = new Map()

    rowNodeIndex = [[], [], [], [], [], [], []]

    setNode(id, startTime, endTime) {
        let node = new Node(id, startTime, endTime)
        this.nodes.push(node)
        this.nodeMap.set(node.id, node)
    }

    setEdge(srcNode_id, dstNode_id) {
        let srcNode = this.nodeMap.get(srcNode_id)
        let dstNode = this.nodeMap.get(dstNode_id)
        srcNode.childNodes.push(dstNode)
        let edge = new Edge(srcNode, dstNode)
        this.edges.push(edge)
        this.edgeMap.set(edge.getEdgeId(srcNode, dstNode), edge)
        srcNode.outEdges.push(edge)
        dstNode.inEdges.push(edge)
        dstNode.hasParent = true
    }

    getRootNodes() {
        this.MIN_TIME = Math.min.apply(Math, this.nodes.map(item => {
            return item.startTime
        }))
        this.MAX_TIME = Math.max.apply(Math, this.nodes.map(item => {
            return item.endTime
        }))

        return this.nodes.filter((n) => n.hasParent === false).sort((a, b) => a.startTime - b.startTime)
    }

    checkOverlap(node) {
        let overlap = false
        for (let placed_node of this.placed_nodes) {
            let x_overlap = (placed_node.startTime <= node.startTime && node.startTime <= placed_node.endTime + 1000)
                || (node.startTime <= placed_node.startTime && placed_node.startTime <= node.endTime + 1000)
            let y_overlap = (placed_node.y === node.y)

            if (x_overlap && y_overlap) {
                // console.log(node.id + ': ' + node.y + ' === ' + placed_node.id + ': ' + placed_node.y)
                overlap = true
            }
        }

        return overlap
    }

    place_node_greedy(node, parent_node_y, parent_node_layer) {
        node.y = parent_node_y
        node.layer = parent_node_layer

        let overlap = false

        while (node.y + this.bar_height < this.greedy_canvas_height - this.padding) {
            overlap = this.checkOverlap(node)

            if (overlap) {
                node.y = node.y + this.bar_height + this.text_height
                node.layer += 1
            } else {
                break
            }
        }

        return overlap
    }

    process_node_greedy(node, parent_node_y, parent_node_layer) {
        let place_out_bound = this.place_node_greedy(node, parent_node_y, parent_node_layer)
        if (place_out_bound) {
            this.greedy_canvas_height += this.bar_height
            this.rowNodeIndex.push([])
        }

        this.placed_nodes.push(node)
        this.rowNodeIndex[node.layer].push(node)

        for (let childNode of node.childNodes) {
            if (childNode.y !== undefined) continue
            this.process_node_greedy(childNode, node.y, node.layer)
        }
    }

    greedyGraphLayout() {

        let link = d3.linkHorizontal()

        let root_nodes = this.getRootNodes()

        for (let rootNode of root_nodes) {
            this.process_node_greedy(rootNode, this.padding, 0)
        }

        // svg.attr("height", this.greedy_canvas_height).attr("width", this.width)

        // let xScale = d3.scaleLinear()
        //     .domain([this.MIN_TIME, this.MAX_TIME])
        //     .range([this.padding, this.width - this.padding])
        //
        // let margin_left = 10
        //
        // for (let node of this.nodes) {
        //     svg.append('rect')
        //         .attr('x', xScale(node.startTime) + this.rowNodeIndex[node.layer].indexOf(node) * margin_left)
        //         .attr('y', node.y)
        //         .attr('width', xScale(node.endTime) - xScale(node.startTime))
        //         .attr('height', this.bar_height)
        //         .style('fill', this.color(this.nodes.indexOf(node)))
        //         .append('title')
        //         .text(node.id)
        //
        //
        //     let text = node.id.replace('Map ', 'M')
        //     text = text.replace('Reducer ', 'R')
        //
        //     svg.append('text')
        //         .text(text)
        //         .attr('text-anchor', 'middle')
        //         .style("font-family", "Arial")
        //         .attr('x', xScale(node.startTime) + this.rowNodeIndex[node.layer].indexOf(node) * margin_left + 5)
        //         .attr('y', node.y - 2)
        //         .attr('fill', '#1e1b1b')
        //         .style('font-size', '0.7em')
        //         .style("font-weight", "bold")
        //
        //     let node_end_x = xScale(node.endTime) + this.rowNodeIndex[node.layer].indexOf(node) * margin_left
        //     let node_end_y = node.y + this.bar_height / 2
        //     for (let childNode of node.childNodes) {
        //         let childNode_start_x = Math.max(xScale(childNode.startTime)
        //             + this.rowNodeIndex[childNode.layer].indexOf(childNode) * margin_left, node_end_x + 2)
        //         let childNode_start_y = childNode.y + this.bar_height / 2
        //
        //         let link_data = {
        //             source: [node_end_x, node_end_y],
        //             target: [childNode_start_x, childNode_start_y]
        //         }
        //
        //         svg.append('path')
        //             .attr('d', link(link_data))
        //             .attr('stroke', 'black')
        //             .attr('fill', 'none')
        //     }
        // }
    }
}
