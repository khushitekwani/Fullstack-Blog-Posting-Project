let conn = require("../../../../config/database");
// let md5 = require("md5");
let responseCode = require("../../../../utilities/response-error-code");
let common = require("../../../../utilities/common");
let constant = require("../../../../config/constant");
// const middleware = require("../../../../middleware/validators")
// const cron = require("node-cron");
// let cryptoLib = require('cryptlib');
// // var template_data = require("../../../../template")
// var shaKey = cryptoLib.getHashSha256(process.env.KEY, 32)
const { t } = require("localizify");
const bcrypt = require("bcrypt");

class userModel {
  async signup(request_data) {
    try {
      var base_url = constant.base_url;
      var data = {
        login_type: request_data.login_type,
        address: request_data.address,
        latitude: request_data.latitude,
        longitude: request_data.longitude,
        profile_image: request_data.profile_image,
      };

      if (request_data.password !== undefined) {
        const saltRounds = 10;
        data.password = await bcrypt.hash(request_data.password, saltRounds);
      }

      if (request_data.social_id !== undefined) {
        data.social_id = request_data.social_id;
      }

      if (
        request_data.login_type !== undefined &&
        request_data.login_type !== "simple"
      ) {
        data.is_verified = 1;
      }

      if (request_data.email !== undefined && request_data.email !== "") {
        data.email = request_data.email;
      }

      var q =
        "SELECT * FROM tbl_user WHERE (email=?) AND ((is_active=1 AND is_deleted=0) OR (is_active=0 AND is_deleted=0))";
      var [result] = await conn.query(q, [request_data.email]);

      if (result.length > 0) {
        return {
          code: responseCode.OPERATION_FAILED,
          message: {
            keyword: t("user_already_exists"),
            content: { field: "email" },
          },
        };
      }

      var insertQuery = "INSERT INTO tbl_user SET ?";
      var result = await conn.query(insertQuery, data);
      var user_id = result[0].insertId;
      const tokenPayload = { id: user_id, email: request_data.email };
      const jwtToken = common.generateJwtToken(tokenPayload);

      var deviceData = {
        user_id: user_id,
        device_type: request_data.device_type,
        os_version: request_data.os_version,
        app_version: request_data.app_version,
        device_token: jwtToken,
        user_token: jwtToken,
        time_zone: request_data.time_zone,
      };
      var q = "INSERT INTO tbl_user_device SET ?";
      await conn.query(q, deviceData);

      var userDetails = await common.getUserDetail(user_id);

      var otpData = {
        otp: common.generateOTP(),
        user_id: user_id,
        mobile: request_data.mobile,
      };
      var que = "INSERT INTO tbl_user_otp SET ?";
      await conn.query(que, otpData);

      var q = `SELECT * FROM tbl_user_device WHERE user_id= ?`;
      var [deviceResult] = await conn.query(q, [user_id]);

      Object.assign(userDetails, deviceResult[0]);
      userDetails.profile_image = `${base_url}/${userDetails.profile_image}`;

      return {
        code: responseCode.SUCCESS,
        message: {
          keyword: t("signup_successfull"),
        },
        data: userDetails,
      };
    } catch (error) {
      return {
        code: responseCode.OPERATION_FAILED,
        message: {
          keyword: error.message,
        },
      };
    }
  }

  async login(req) {
    try {
      let base_url = constant.base_url;
      let request_data = req.body;
      let q = "";
      let condition = [];
      let plainPassword = request_data.password;

      if (request_data.login_type === "simple") {
        if (request_data.email !== undefined && request_data.email !== "") {
          q =
            "SELECT * FROM tbl_user WHERE email=? AND is_active=1 AND is_deleted=0";
          condition = [request_data.email];
        }
      } else {
        q =
          "SELECT * FROM tbl_user WHERE social_id=? AND is_active=1 AND is_deleted=0";
        condition = [request_data.social_id];
      }

      let [result] = await conn.query(q, condition);

      if (result.length === 0) {
        return {
          code: responseCode.OPERATION_FAILED,
          message: {
            keyword: t("login_invalid_credential"),
            content: {
              credential:
                request_data.login_type === "simple"
                  ? "Email / phone or Password"
                  : "Social ID",
            },
          },
        };
      }

      let user = result[0];

      if (request_data.login_type === "simple") {
        const passwordMatch = await bcrypt.compare(
          plainPassword,
          user.password
        );
        if (!passwordMatch) {
          return {
            code: responseCode.OPERATION_FAILED,
            message: {
              keyword: t("login_invalid_credential"),
              content: { credential: "Email / phone or Password" },
            },
          };
        }
      }

      if (user.is_active === 1) {
        if (user.is_deleted === 0) {
          const tokenPayload = { id: user.id, email: user.email };
          const jwtToken = common.generateJwtToken(tokenPayload);

          let deviceData = {
            device_type: request_data.device_type,
            os_version: request_data.os_version,
            app_version: request_data.app_version,
            device_token: jwtToken,
            user_token: jwtToken,
            time_zone: request_data.time_zone,
          };
          let updateData = {
            latitude: request_data.latitude,
            longitude: request_data.longitude,
          };

          await conn.query("UPDATE tbl_user SET ? WHERE id=?", [
            updateData,
            user.id,
          ]);
          await conn.query("UPDATE tbl_user_device SET ? WHERE user_id=?", [
            deviceData,
            user.id,
          ]);

          let [userResult] = await conn.query(
            "SELECT * FROM tbl_user WHERE id=?",
            [user.id]
          );
          let d = { ...userResult[0] };
          d.profile_image = `${base_url}/${d.profile_image}`;

          let [deviceResult] = await conn.query(
            "SELECT * FROM tbl_user_device WHERE user_id=?",
            [user.id]
          );
          d.deviceDetails = deviceResult[0];

          return {
            code: responseCode.SUCCESS,
            message: {
                keyword: t('login_success'),
                content: { name: user.email }
            },
            data: {
                ...d,
                token: jwtToken
            }
        };
        } else {
          return {
            code: responseCode.NOT_REGISTER,
            message: { keyword: t("login_invalid_credential") },
          };
        }
      } else {
        return {
          code: responseCode.CODE_NULL,
          message: { keyword: t("user_blocked") },
        };
      }
    } catch (error) {
      return {
        code: responseCode.OPERATION_FAILED,
        message: { keyword: error.message },
      };
    }
  }

  async allPost(req) {
    try {
      const postQuery = `
                SELECT * FROM tbl_post 
                ORDER BY created_at DESC
            `;
      const [posts] = await conn.query(postQuery);

      return {
        code: responseCode.SUCCESS,
        message: {
          keyword: "post_loaded",
        },
        data: {
          posts: posts || [],
        },
      };
    } catch (error) {
      console.error("Database error in allPost:", error);
      return {
        code: responseCode.OPERATION_FAILED,
        message: {
          keyword: "operation_failed",
        },
      };
    }
  }

  async createPost(req) {
    try {
      const data = {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
        tag: req.body.tag,
        // user_id: req.user_id
      };
      const q = "INSERT INTO tbl_post SET ?";
      await conn.query(q, data);
      console.log(data);
      return {
        code: responseCode.SUCCESS,
        message: {
          keyword: t("post_added"),
        },

        data: { data },
      };
    } catch (error) {
      return {
        code: responseCode.OPERATION_FAILED,
        message: {
          keyword: error.message,
        },
      };
    }
  }

  async deletePost(req) {
    try {
      const post_id = req.body.post_id;

      const user_id = req.user_id;
      console.log(post_id);
      console.log(user_id);
      if (!post_id) {
        return {
          code: responseCode.INVALID_REQUEST,
          message: {
            keyword: "invalid_post_id",
          },
        };
      }

      const query = "DELETE FROM tbl_post WHERE id = ?";
      const [result] = await conn.query(query, [post_id]);

      if (result.affectedRows === 0) {
        return {
          code: responseCode.NOT_FOUND,
          message: {
            keyword: "post_not_found",
          },
        };
      }

      return {
        code: responseCode.SUCCESS,
        message: {
          keyword: "post_deleted",
        },
        data: { deleted: true, post_id },
      };
    } catch (error) {
      console.error("Database error in deletePost:", error);
      return {
        code: responseCode.OPERATION_FAILED,
        message: {
          keyword: "operation_failed",
        },
      };
    }
  }

  async updatePost(req) {
    try {
      const post_id = req.body.post_id;
      console.log(post_id);
      const { title, content, status, tag } = req.body;
      console.log(title, content, status, tag);

      let tagValue = tag;
      if (Array.isArray(tag)) {
        tagValue = tag.join(",");
      }

      const query =
        "UPDATE tbl_post SET title = ?, content = ?, status = ?, tag = ? WHERE id = ?";
      await conn.query(query, [title, content, status, tagValue, post_id]);

      return {
        code: responseCode.SUCCESS,
        message: {
          keyword: "post_updated",
        },
      };
    } catch (error) {
      console.error("Database error in updatePost:", error);
      return {
        code: responseCode.OPERATION_FAILED,
        message: {
          keyword: "operation_failed",
        },
      };
    }
  }

  async postDetails(req) {
    try {
      const post_id = req.body.post_id;
      console.log(post_id);

      const query = "SELECT * FROM tbl_post WHERE id = ?";
      const [result] = await conn.query(query, [post_id]);

      if (result.length === 0) {
        return {
          code: responseCode.NOT_FOUND,
          message: {
            keyword: "post_not_found",
          },
        };
      }

      return {
        code: responseCode.SUCCESS,
        message: {
          keyword: "post_details_fetched",
        },
        data: result[0],
      };
    } catch (error) {
      console.error("Database error in postDetails:", error);
      return {
        code: responseCode.OPERATION_FAILED,
        message: {
          keyword: "operation_failed",
        },
      };
    }
  }
}

module.exports = new userModel();
