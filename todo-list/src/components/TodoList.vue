<template>
  <div>
    <h1>
      <h1 class="bordered-text">Maru Lista de Tarefas</h1>
    </h1>
    <div class="input-container">
      <input
        v-model="taskInput"
        @keyup.enter="addTask"
        placeholder="Adicionar uma tarefa"
      />
      <button class="action-button small-button" @click="addTask">
        Adicionar
      </button>
    </div>
    <ul class="task-list">
      <li v-for="(task, index) in tasks" :key="index">
        <div
          class="task-frame"
          :style="task.isCompleted ? 'border: 4px solid green;' : ''"
        >
          <label
            class="task-label"
            :class="{ 'completed-task': task.isCompleted }"
            v-html="formatTaskText(task.text)"
          ></label>
          <div class="action-buttons">
            <button class="custom-action-button" @click="editTask(index)">
              Editar
            </button>
            <button class="custom-action-button" @click="removeTask(index)">
              Remover
            </button>
            <button
              class="custom-action-button"
              @click="toggleTaskStatus(index)"
            >
              {{ task.isCompleted ? "Reativar" : "Concluir" }}
            </button>
          </div>
        </div>
      </li>
    </ul>

    <div class="action-buttons-bottom">
      <button class="action-button" @click="exportTasks">
        Exportar para JSON
      </button>
      <label for="file-upload" class="custom-file-input">Procurar</label>
      <input
        type="file"
        id="file-upload"
        @change="importTasksFromFile"
        accept=".json"
        style="display: none"
      />
      <button class="action-button" @click="clearAll">Limpar Tudo</button>
      <button
        class="action-button confirm-import-button"
        @click="confirmImport"
        v-if="importedTasks.length"
      >
        Confirmar Importação
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taskInput: "",
      tasks: [],
      importedTasks: [],
    };
  },
  methods: {
    formatTaskText(text) {
      const linkPattern = /(\bhttps?:\/\/\S+\b)/gi;
      return text.replace(linkPattern, '<a href="$1" target="_blank">$1</a>');
    },
    toggleTaskStatus(index) {
      this.tasks[index].isCompleted = !this.tasks[index].isCompleted;
      this.saveTasksToLocalStorage();
    },
    addTask() {
      if (this.taskInput) {
        this.tasks.push({ text: this.taskInput, isCompleted: false });
        this.taskInput = "";
        this.saveTasksToLocalStorage(); // Save tasks to local storage
      }
    },
    editTask(index) {
      const updatedText = prompt("Editar tarefa:", this.tasks[index].text);
      if (updatedText !== null) {
        this.tasks[index].text = updatedText;
        this.saveTasksToLocalStorage(); // Save tasks to local storage
      }
    },
    removeTask(index) {
      this.tasks.splice(index, 1);
      this.saveTasksToLocalStorage(); // Save tasks to local storage
    },
    exportTasks() {
      const tasksJSON = JSON.stringify(this.tasks);
      const blob = new Blob([tasksJSON], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasks.json";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    importTasksFromFile(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            this.importedTasks = JSON.parse(reader.result);
          } catch (error) {
            console.error("Erro ao importar tarefas:", error);
          }
        };
        reader.readAsText(file);
      }
    },
    confirmImport() {
      this.tasks = [...this.tasks, ...this.importedTasks];
      this.saveTasksToLocalStorage(); // Save tasks to local storage
      this.importedTasks = [];
    },
    clearAll() {
      this.tasks = [];
      this.saveTasksToLocalStorage(); // Save tasks to local storage
    },
    saveTasksToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
  },
  created() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  },
};
</script>

<style>
.task-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 20px;
}

h1 {
  text-align: center;
  font-size: 70px;
  margin: 20px 0;
}
.bordered-text {
  -webkit-text-stroke: 2px rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}
.input-container input {
  width: 60%;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
}

.action-button {
  background-color: #3a3a3a;
  color: #ffffff;
  padding: 10px 15px;
  border: 2px solid #000000;
  cursor: pointer;
  font-size: 15px;
  border-radius: 12px;
  transition: background-color 0.3s, transform 0.3s;
  margin: 5px;
  width: 90%;
  text-align: center;
}

.action-button.small-button {
  padding: 7px 14px;
  font-size: 12px;
  width: 20%;
}

.action-button:hover,
.confirm-import-button:hover,
.custom-file-input:hover {
  background-color: #646464;
}

.task-frame {
  width: 200px;
  height: 200px;
  border: 2px solid #313131;
  margin: 10px;
  padding: 10px;
  font-size: 15px;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #3d3d3d;
}

.task-label {
  width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ffffff;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 20px;
  font-style: inherit;
  padding: 10px;
  line-height: 20px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}
.action-buttons-bottom {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

li {
  list-style-type: none;
  background-color: #000000;
  border-radius: 12px;
  transition: background-color 0.3s, transform 0.3s;
  margin: 5px;
}

.custom-file-input {
  background-color: #383838;
  color: #ffffff;
  padding: 10px 15px;
  border: 2px solid #000000;
  cursor: pointer;
  font-size: 15px;
  border-radius: 12px;
  transition: background-color 0.3s, transform 0.3s;
  margin: 5px;
  width: 69%;
  text-align: center;
}
.small-button {
  padding: 7px 14px; /* Adjust the padding to control button size */
  font-size: 12px; /* Adjust the font size if needed */
  width: 20%;
}
html,
body {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1009%26quot%3b)' fill='none'%3e%3crect width='1440' height='560' x='0' y='0' fill='rgba(95%2c 95%2c 95%2c 1)'%3e%3c/rect%3e%3cpath d='M967.17 89.7L1004.16 89.7L1004.16 98.99L967.17 98.99z' fill='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M389.76 353.86 a32.63 32.63 0 1 0 65.26 0 a32.63 32.63 0 1 0 -65.26 0z' stroke='rgba(133%2c 133%2c 133%2c 1)'%3e%3c/path%3e%3cpath d='M1382.66 38.32L1419.77 38.32L1419.77 75.43L1382.66 75.43z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M1296.72 181.09L1334.65 181.09L1334.65 226.21L1296.72 226.21z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M41.39 80.83L43.56 80.83L43.56 83L41.39 83z' stroke='rgba(74%2c 84%2c 89%2c 1)'%3e%3c/path%3e%3cpath d='M147.59 264.52L186.71 264.52L186.71 303.64L147.59 303.64z' fill='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M958.15 16.27a51.69 51.69 0 1 0 86.02 57.34z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M1381 274.79 a28.75 28.75 0 1 0 57.5 0 a28.75 28.75 0 1 0 -57.5 0z' fill='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M292.44 444.65 a12.86 12.86 0 1 0 25.72 0 a12.86 12.86 0 1 0 -25.72 0z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M594.96 313.75L633.53 313.75L633.53 369.13L594.96 369.13z' fill='rgba(133%2c 133%2c 133%2c 1)'%3e%3c/path%3e%3cpath d='M325.97 71.89 a30.35 30.35 0 1 0 60.7 0 a30.35 30.35 0 1 0 -60.7 0z' fill='rgba(61%2c 61%2c 61%2c 1)'%3e%3c/path%3e%3cpath d='M807.95 276.74 a1.39 1.39 0 1 0 2.78 0 a1.39 1.39 0 1 0 -2.78 0z' stroke='rgba(61%2c 61%2c 61%2c 1)'%3e%3c/path%3e%3cpath d='M311.81 393.76L326.58 393.76L326.58 408.53L311.81 408.53z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M249.45 23.66a35.03 35.03 0 1 0 38.44 58.57z' fill='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M1144.39 80.93a44.02 44.02 0 1 0-52.89-70.39z' fill='rgba(133%2c 133%2c 133%2c 1)'%3e%3c/path%3e%3cpath d='M227.53 511.88 a47.01 47.01 0 1 0 94.02 0 a47.01 47.01 0 1 0 -94.02 0z' stroke='rgba(61%2c 61%2c 61%2c 1)'%3e%3c/path%3e%3cpath d='M501.51 107.9a36.93 36.93 0 1 0 73.84-1.28z' stroke='rgba(74%2c 84%2c 89%2c 1)'%3e%3c/path%3e%3cpath d='M477.91 452.8L513.44 452.8L513.44 488.33L477.91 488.33z' stroke='rgba(61%2c 61%2c 61%2c 1)'%3e%3c/path%3e%3cpath d='M1243.46 392.62 a53.67 53.67 0 1 0 107.34 0 a53.67 53.67 0 1 0 -107.34 0z' stroke='rgba(74%2c 84%2c 89%2c 1)'%3e%3c/path%3e%3cpath d='M1202.74 331.42a34.73 34.73 0 1 0-4.18-69.34z' fill='rgba(133%2c 133%2c 133%2c 1)'%3e%3c/path%3e%3cpath d='M44.13 363.84L99.01 363.84L99.01 418.72L44.13 418.72z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M99.19 67.19L148.28 67.19L148.28 116.28L99.19 116.28z' stroke='rgba(74%2c 84%2c 89%2c 1)'%3e%3c/path%3e%3cpath d='M1371.27 524.74L1379.69 524.74L1379.69 560.15L1371.27 560.15z' fill='rgba(133%2c 133%2c 133%2c 1)'%3e%3c/path%3e%3cpath d='M1316.51 447.47L1324.46 447.47L1324.46 449.85L1316.51 449.85z' fill='rgba(133%2c 133%2c 133%2c 1)'%3e%3c/path%3e%3cpath d='M296.42 97.41a50.23 50.23 0 1 0-94.5-34.09z' stroke='rgba(74%2c 84%2c 89%2c 1)'%3e%3c/path%3e%3cpath d='M75.06 445.57L105.53 445.57L105.53 471.51L75.06 471.51z' fill='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M669.57 360.74 a45.02 45.02 0 1 0 90.04 0 a45.02 45.02 0 1 0 -90.04 0z' fill='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M604.56 463.19L631.42 463.19L631.42 515.62L604.56 515.62z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M1115.81 321.28L1148.32 321.28L1148.32 323.07L1115.81 323.07z' fill='rgba(61%2c 61%2c 61%2c 1)'%3e%3c/path%3e%3cpath d='M1214.59 507.28L1269.19 507.28L1269.19 561.88L1214.59 561.88z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M1075.45 465.64L1129.75 465.64L1129.75 521.35L1075.45 521.35z' fill='rgba(61%2c 61%2c 61%2c 1)'%3e%3c/path%3e%3cpath d='M548.49 408.54L567.46 408.54L567.46 427.51L548.49 427.51z' stroke='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3cpath d='M225.9 204L247.29 204L247.29 214.14L225.9 214.14z' fill='rgba(0%2c 0%2c 0%2c 1)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1009'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e");
}
.input-container,
input {
  border-radius: 12px;
  color: #444444;
}
.confirm-import-button {
  background-color: #3a3a3a;
  color: #ffffff;
  padding: 10px 15px;
  border: 2px solid #000000;
  cursor: pointer;
  font-size: 15px;
  border-radius: 12px;
  transition: background-color 0.3s, transform 0.3s;
  margin: 5px;
  width: 90%;
  text-align: center;
}
.completed-task {
  text-decoration: line-through;
}
.custom-action-button {
  background-color: #3a3a3a;
  padding: 5px 10px;
  border-radius: 12px;
  margin: 3px;
  border: 2px solid #000000;
  color: #ffffff;
}
.task-label a {
  color: #55ec83; 
  text-decoration:none; 
}
</style>
