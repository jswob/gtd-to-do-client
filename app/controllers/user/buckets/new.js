import Controller from "@ember/controller";
import CreateBucketValidations from "../../../validations/create-bucket";

export default class UserBucketsNewController extends Controller {
  CreateBucketValidations = CreateBucketValidations;
}
