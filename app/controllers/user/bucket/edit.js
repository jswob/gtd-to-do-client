import Controller from "@ember/controller";
import CreateBucketValidations from "../../../validations/create-bucket";
import { union } from "@ember/object/computed";

export default class UserBucketEditController extends Controller {
  CreateBucketValidations = CreateBucketValidations;

  @union("model.bucketCollections", "model.freeCollections") collections;
}
