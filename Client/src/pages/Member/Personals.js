import React from "react";

const Personals = () => {
  return (
    <div class="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
      <div class="container max-w-screen-lg mx-auto">
        <div>
          <h2 class="font-semibold text-xl text-gray-600">Responsive Form</h2>
          <p class="text-gray-500 mb-6">
            Form is mobile responsive. Give it a try.
          </p>

          <div class="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
            <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div class="text-gray-600">
                <p class="font-medium text-lg">Personal Details</p>
                <p>Please fill out all the fields.</p>
              </div>

              <div class="lg:col-span-2">
                <form
                  onSubmit={handleSubmit(handleUpdateinfor)}
                  className="w-[60%] mx-auto flex flex-col py-8 gap-4">
                  <InputForm
                    label="Firstname"
                    register={register}
                    errors={errors}
                    id="firstname"
                    validate={{
                      required: "Need fill this field",
                    }}
                  />
                  <InputForm
                    label="Lastname"
                    register={register}
                    errors={errors}
                    id="lastname"
                    validate={{
                      required: "Need fill this field",
                    }}
                  />
                  <InputForm
                    label="Email address"
                    register={register}
                    errors={errors}
                    id="email"
                    validate={{
                      required: "Need fill this field",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email invalid",
                      },
                    }}
                  />
                  <InputForm
                    label="Phone"
                    register={register}
                    errors={errors}
                    id="mobile"
                    validate={{
                      required: "Need fill this field",
                      pattern: {
                        value: /^[0-9 +\-()]+$/,
                        message:
                          "Mobile number must be at least 10 digits long.",
                      },
                    }}
                  />
                  <InputForm
                    label="Address"
                    register={register}
                    errors={errors}
                    id="address"
                    validate={{
                      required: "Need fill this field",
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Account status : </span>
                    <span>{current?.isBlocked ? "Blocked" : "Actived"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Role : </span>
                    <span>{+current?.role === 1945 ? "Admin" : "User"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Create At : </span>
                    <span>
                      {moment(current?.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-medium">Profile images :</span>
                    <label htmlFor="file">
                      <img
                        src={current?.avatar || avatar}
                        alt="avata"
                        className="w-20 h-20 object-cover rounded-full"></img>
                    </label>
                    <input
                      type="file"
                      id="file"
                      {...register("avatar")}
                      hidden></input>
                  </div>
                  <Button type="submit">Update information</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personals;
