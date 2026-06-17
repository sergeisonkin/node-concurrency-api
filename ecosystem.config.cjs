module.exports = {
  apps : [{
    name   : "cluster",
    script : "./src/cluster.ts",
    interpreter: "tsx",
    instances: "max"
  }]
}
