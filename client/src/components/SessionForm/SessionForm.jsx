import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import RadiusSlider from "../RadiusSlider/RadiusSlider";
import LocationPicker from "../LocationPicker/LocationPicker";
import Loader from "../Loader/Loader";
import "./SessionForm.css";

const subjects = [
  "Data Structures",
  "DBMS",
  "Operating System",
  "Computer Networks",
  "Java",
  "Web Development",
];
const classes = ["CSE-A", "CSE-B", "CSE-C"];
const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const lateDurations = ["5 min", "10 min", "15 min", "30 min"];

export default function SessionForm({
  onSubmitSuccess,
  onLiveChange,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      subject: "",
      className: "",
      semester: "",
      room: "",
      date: "",
      startTime: "",
      endTime: "",
      radius: 20,
      location: {},
      sessionType: "Theory",
      allowLateEntry: false,
      lateDuration: "10 min",
      notes: "",
    },
  });

  const watched = watch();

  // keep the live preview in sync on every change
  useState(() => {}, []);

  const onSubmit = async (data) => {
    if (!data.location?.latitude) {
      return;
    }
    // TODO: replace with real API call, e.g.
    // await axios.post('/api/teacher/sessions', data);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    onSubmitSuccess(data);
  };

  // push every render's values up so SessionPreview stays live
  onLiveChange(watched);

  return (
    <motion.form
      className="session-form"
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      noValidate
    >
      <div className="form-grid-2">
        <div className="form-field">
          <label>Subject Name</label>
          <select {...register("subject", { required: "Subject is required" })}>
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="field-error">{errors.subject.message}</p>
          )}
        </div>

        <div className="form-field">
          <label>Class / Section</label>
          <select {...register("className", { required: "Class is required" })}>
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.className && (
            <p className="field-error">{errors.className.message}</p>
          )}
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label>Semester</label>
          <select
            {...register("semester", { required: "Semester is required" })}
          >
            <option value="">Select semester</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s} Semester
              </option>
            ))}
          </select>
          {errors.semester && (
            <p className="field-error">{errors.semester.message}</p>
          )}
        </div>

        <div className="form-field">
          <label>Room Number</label>
          <input
            type="text"
            placeholder="e.g. Room 204"
            {...register("room", { required: "Room number is required" })}
          />
          {errors.room && <p className="field-error">{errors.room.message}</p>}
        </div>
      </div>

      <div className="form-grid-3">
        <div className="form-field">
          <label>Date</label>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && <p className="field-error">{errors.date.message}</p>}
        </div>

        <div className="form-field">
          <label>Start Time</label>
          <input
            type="time"
            {...register("startTime", { required: "Start time is required" })}
          />
          {errors.startTime && (
            <p className="field-error">{errors.startTime.message}</p>
          )}
        </div>

        <div className="form-field">
          <label>End Time</label>
          <input
            type="time"
            {...register("endTime", {
              required: "End time is required",
              validate: (value) =>
                value > watched.startTime ||
                "End time must be after start time",
            })}
          />
          {errors.endTime && (
            <p className="field-error">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      <Controller
        control={control}
        name="radius"
        render={({ field }) => (
          <RadiusSlider value={field.value} onChange={field.onChange} />
        )}
      />

      <Controller
        control={control}
        name="location"
        rules={{
          validate: (loc) => !!loc?.latitude || "Please detect your location",
        }}
        render={({ field }) => (
          <LocationPicker
            location={field.value}
            onLocationChange={field.onChange}
            radius={watched.radius}
            error={errors.location?.message}
          />
        )}
      />

      <div className="form-field">
        <label>Session Type</label>
        <div className="radio-row">
          {["Theory", "Lab", "Tutorial"].map((type) => (
            <label key={type} className="radio-pill">
              <input type="radio" value={type} {...register("sessionType")} />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="form-field toggle-field">
        <div className="toggle-label-row">
          <label>Allow Late Entry</label>
          <label className="switch">
            <input type="checkbox" {...register("allowLateEntry")} />
            <span className="switch-slider" />
          </label>
        </div>

        {watched.allowLateEntry && (
          <motion.select
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            {...register("lateDuration")}
            className="late-duration-select"
          >
            {lateDurations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </motion.select>
        )}
      </div>

      <div className="form-field">
        <label>
          Session Notes <span className="optional-tag">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Add any notes for this session..."
          {...register("notes")}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-outline-cancel" onClick={onCancel}>
          Cancel
        </button>
        <motion.button
          type="submit"
          className="btn-create-session"
          disabled={isSubmitting}
          whileHover={{ y: isSubmitting ? 0 : -3 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
        >
          {isSubmitting ? (
            <>
              <Loader /> Creating Session...
            </>
          ) : (
            <>
              Create Session <FiArrowRight />
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
