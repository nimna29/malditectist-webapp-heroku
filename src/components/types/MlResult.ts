/* Defining the interface of the object that will be returned by the API. */
export interface MlResult {
    prediction: string;
    rf_probability: string;
    nn_prediction: string;
}
