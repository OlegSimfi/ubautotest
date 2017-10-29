var a = 10, b = 20
console.log(`select id from uba_user where id in (:${JSON.stringify([a, b])}:)`)
