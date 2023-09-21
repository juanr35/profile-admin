import { Schema } from "mongoose"

const airbnbSchema = new Schema({
    chart: String,
    feature_type: String,
    londec: Number,
    latdec: Number,
})

export default airbnbSchema