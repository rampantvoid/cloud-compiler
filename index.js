const { spawn } = require("child_process");
const fs = require("fs/promises");
const { once } = require("events");

const uint8arrayToString = (data) => {
  return String.fromCharCode.apply(null, data);
};

const execute_python = async (code) => {
  await fs.writeFile("script.py", code);
  let output;
  const execution = spawn("python3", ["script.py"]);

  execution.stdout.on("data", (data) => {
    output = uint8arrayToString(data);
  });

  execution.stderr.on("data", (data) => {
    output = uint8arrayToString(data);
  });

  execution.on("exit", (code) => {
    console.log("Process quit with code : " + code);
  });

  await once(execution, "close");

  return output;
};

const execute_cpp = async (code) => {
  await fs.writeFile("temp.cpp", code);
  let output;
  let error = "";

  const compile = spawn("g++", ["temp.cpp", "-o", "temp"]);

  compile.stdout.on("data", (data) => {
    console.log(uint8arrayToString(data));
  });

  compile.stderr.on("data", (data) => {
    error = uint8arrayToString(data);
  });

  compile.on("exit", (code) => {
    console.log("Process quit with code : " + code);
  });
  await once(compile, "close");

  if (error) {
    return error;
  }

  const execution = spawn("./temp");

  execution.stdout.on("data", (data) => {
    output = uint8arrayToString(data);
  });

  execution.stderr.on("data", (data) => {
    output = uint8arrayToString(data);
  });

  execution.on("exit", (code) => {
    console.log("Process quit with code : " + code);
  });

  await once(execution, "close");

  return output;
};

const execute_c = async (code) => {
  await fs.writeFile("temp.c", code);
  let output;
  let error = "";

  const compile = spawn("gcc", ["temp.c", "-o", "temp"]);

  compile.stdout.on("data", (data) => {
    console.log(uint8arrayToString(data));
  });

  compile.stderr.on("data", (data) => {
    error = uint8arrayToString(data);
  });

  compile.on("exit", (code) => {
    console.log("Process quit with code : " + code);
  });
  await once(compile, "close");

  if (error) {
    return error;
  }

  const execution = spawn("./temp");

  execution.stdout.on("data", (data) => {
    output = uint8arrayToString(data);
  });

  execution.stderr.on("data", (data) => {
    output = uint8arrayToString(data);
  });

  execution.on("exit", (code) => {
    console.log("Process quit with code : " + code);
  });

  await once(execution, "close");

  return output;
};

exports.handler = async (event, context) => {
  const language = event.language;
  const code = event.code;
  let output;
  if (language === "python") {
    output = await execute_python(code);
  } else if (language === "java") {
    output = await execute_java(code);
  } else if (language === "cpp") {
    output = await execute_cpp(code);
  } else if (language === "c") {
    output = await execute_c(code);
  } else {
    output = "Unsupported Language";
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify(output),
  };
  return response;
};
