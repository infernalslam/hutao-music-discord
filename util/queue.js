class Queue {
    items = []

    enqueue(item){
        this.items.push(item)
    }

    peek(){
        if(this.size() > 0) return this.items[0]
        return null
    }

    dequeue(){
        if(this.size()===0){
            return null
        }else{
            return this.items.shift()
        }
    }

    size(){
        return this.items.length
    }

    isEmpty(){
        return this.size() <= 0
    }
}

module.exports = Queue