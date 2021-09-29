class APIService {
    constructor(apiRequest) {
        this.apiRequest = apiRequest
    }

    getListData = ({offset, limit, onSuccess, onError}) => {
        this.apiRequest.getListData(offset, limit).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getListData", e)
            }
        })
    }

    getData = ({id, onSuccess, onError}) => {
        this.apiRequest.getData(id).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("getData", e)
            }
        })
    }

    createData = ({data, onSuccess, onError}) => {
        this.apiRequest.createData(data).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("createData", e)
            }
        })
    }

    updateData = ({data, onSuccess, onError}) => {
        this.apiRequest.updateData(data).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("updateData", e)
            }
        })
    }

    deleteData = ({id, onSuccess, onError}) => {
        this.apiRequest.deleteData(id).then(res => {
            onSuccess(res.data)
        }).catch(e => {
            if (onError instanceof Function){
                onError(e)
            } else {
                console.log("deleteData", e)
            }
        })
    }
}

export default APIService;