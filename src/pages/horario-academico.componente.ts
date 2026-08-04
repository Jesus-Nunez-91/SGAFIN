import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, ClassSchedule } from '../services/data.service';

declare const Swal: any;

@Component({
    selector: 'app-schedule',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-7xl mx-auto py-8 animate-fadeIn pb-20">
      
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row items-center justify-between mb-8 bg-white/80 dark:bg-gray-900/80 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-xl">
          <div class="text-center md:text-left w-full md:w-auto">
              <h1 class="text-xl md:text-3xl font-black text-[#003366] dark:text-gray-100 flex items-center justify-center md:justify-start gap-3 tracking-tighter uppercase">
                  <span class="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#f06427] flex items-center justify-center text-white shadow-lg text-lg">
                      <i class="bi bi-calendar-week-fill" aria-hidden="true"></i>
                  </span>
                  Horarios <span class="hidden sm:inline">Académicos</span> <span class="text-[#f06427]">UAH</span>
              </h1>
              <p class="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1 md:ml-16">Infraestructura Institucional • 5 Laboratorios</p>
          </div>
          
          <div class="mt-4 md:mt-0 flex items-center gap-4">
               @if (canEditSchedules()) {
                 <div class="flex gap-2">
                   <button (click)="exportSchedule()" 
                           title="Descargar Horario Actual"
                           class="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 hover:text-emerald-700 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center">
                     <i class="bi bi-file-earmark-spreadsheet-fill text-lg"></i>
                   </button>
                   
                   <button (click)="toggleEditMode()" 
                           [title]="isEditMode() ? 'Salir de Edición' : 'Modo Edición'"
                           [class]="isEditMode() ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 border-gray-300'"
                           class="border p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center ml-1">
                     <i class="bi text-lg" [class]="isEditMode() ? 'bi-pencil-fill' : 'bi-pencil'"></i>
                   </button>
                 </div>
               }
                 <div class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-[10px] md:text-xs font-black text-[#003366] dark:text-blue-300 flex items-center gap-2 uppercase tracking-widest">
                    <span class="relative flex h-2 w-2 md:h-3 md:w-3">
                       <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-[#f06427]"></span>
                    </span>
                    S2 - 2026
                </div>
          </div>
      </div>

      <!-- Lab Selector Tabs (5 Laboratorios con íconos completos) -->
      <div class="flex flex-wrap justify-center items-center gap-3 mb-8">
          @for (lab of dynamicLabs(); track lab) {
               <button (click)="selectedLab.set(lab)"
                       [class]="selectedLab() === lab 
                         ? 'bg-[#003366] text-white shadow-xl shadow-blue-900/20 scale-105 border-[#f06427]' 
                         : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#f06427] border-gray-200 dark:border-gray-800'"
                      class="px-5 py-3 rounded-2xl font-black transition-all duration-300 border-2 flex items-center gap-2.5 uppercase text-xs tracking-wider shadow-sm">
                   <i [class]="getIcon(lab)" class="text-base text-[#f06427]"></i>
                   <span>{{ getLabDisplayName(lab) }}</span>
              </button>
          }
          
          @if (canEditSchedules()) {
              <div class="flex items-center gap-2 ml-2">
                 <button (click)="addNewLab()"
                         class="px-4 py-3 rounded-2xl font-black text-white bg-emerald-500 hover:bg-emerald-600 shadow-md transition-all flex items-center gap-1.5 text-xs uppercase tracking-wider">
                     <i class="bi bi-plus-circle-fill"></i> Categoría
                 </button>
                 @if (!['FABLAB', 'HACKERLAB', 'DESARROLLO TECNOLOGICO', 'FISICA', 'QUIMICA'].includes(selectedLab().toUpperCase())) {
                   <button (click)="deleteCurrentLab()"
                           class="px-4 py-3 rounded-2xl font-black text-white bg-red-500 hover:bg-red-600 shadow-md transition-all flex items-center gap-1.5 text-xs uppercase tracking-wider"
                           [title]="'Eliminar sala ' + selectedLab()">
                       <i class="bi bi-trash-fill"></i>
                   </button>
                 }
              </div>
          }
      </div>

      <!-- The Schedule Grid -->
      <div class="bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800 relative text-black dark:text-white" role="grid" [attr.aria-label]="'Cuadrícula de Horarios de ' + selectedLab()">
          
          <div class="overflow-x-auto custom-scrollbar">
              <div class="min-w-[950px] p-5 md:p-8">
                  
                  <!-- Days Header -->
                  <div class="grid grid-cols-6 gap-3 mb-4" role="row">
                       <div class="flex items-center justify-center font-black text-gray-400 dark:text-gray-500 uppercase text-[10px] tracking-widest bg-gray-100 dark:bg-gray-800/80 rounded-2xl p-3">
                           BLOQUE HORARIO
                       </div>
                      @for (day of days; track day) {
                          <div class="text-center bg-gray-50 dark:bg-gray-800/60 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50" role="columnheader">
                               <div class="font-black text-[#003366] dark:text-gray-100 text-sm uppercase tracking-tight">{{ day }}</div>
                               <div class="h-1 w-8 bg-[#f06427] rounded-full mx-auto mt-1"></div>
                          </div>
                      }
                  </div>

                  <!-- Time Blocks Rows -->
                  <div class="space-y-3">
                      @for (block of timeBlocks; track block) {
                          <div class="grid grid-cols-6 gap-3 group" role="row">
                              <!-- Time Column -->
                               <div class="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl text-[10px] font-black text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/80 group-hover:bg-blue-50 dark:group-hover:bg-indigo-900/20 transition-colors uppercase tracking-tight px-2 py-3 text-center" role="rowheader">
                                  {{ block }}
                               </div>

                              <!-- Days Columns -->
                              @for (day of days; track day) {
                                  @let cellClass = getClass(day, block);
                                  
                                   <div (click)="editCell(day, block, cellClass)"
                                        role="gridcell"
                                        [attr.aria-label]="day + ', bloque ' + block + ': ' + (cellClass ? cellClass.subject : 'Disponible')"
                                        class="relative p-4 rounded-2xl border-2 min-h-[100px] flex flex-col justify-between transition-all duration-300"
                                        [class.shadow-md]="cellClass"
                                        [class.hover:shadow-lg]="cellClass || isEditMode()"
                                        [class.hover:-translate-y-0.5]="cellClass"
                                        [class.bg-gray-50/40]="!cellClass && !isEditMode()"
                                        [class.dark:bg-gray-800/40]="!cellClass && !isEditMode()"
                                        [class.border-dashed]="!cellClass"
                                        [class.border-gray-200]="!cellClass"
                                        [class.dark:border-gray-700/60]="!cellClass"
                                        [style.backgroundColor]="cellClass ? getBgColor(cellClass.color) : ''"
                                        [style.borderColor]="cellClass ? getBorderColor(cellClass.color) : ''"
                                        [class.cursor-pointer]="isEditMode()"
                                        [class.ring-4]="isEditMode()"
                                        [class.ring-amber-400]="isEditMode()"
                                        [class.shadow-2xl]="isEditMode()"
                                        [class.z-20]="isEditMode()">
                                        
                                        @if (cellClass) {
                                            <div class="flex items-center justify-between mb-1.5">
                                                <span class="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md" 
                                                      [style.backgroundColor]="getBadgeBgColor(cellClass.color)" 
                                                      [style.color]="cellClass.color || '#003366'">
                                                    CLASE
                                                </span>
                                            </div>
                                            <div class="font-black text-gray-900 dark:text-gray-100 text-[11px] leading-snug line-clamp-4">
                                                {{ cellClass.subject }}
                                            </div>
                                        } @else {
                                            <div class="m-auto text-center">
                                                <span class="text-[9px] text-gray-300 dark:text-gray-600 font-bold uppercase tracking-widest">Disponible</span>
                                            </div>
                                        }

                                        @if (isEditMode()) {
                                            <div class="absolute inset-0 bg-amber-500/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px]">
                                                <div class="bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg border border-amber-200 dark:border-amber-900">
                                                    <i class="bi bi-pencil-square text-amber-600 text-xl"></i>
                                                </div>
                                            </div>
                                        }
                                   </div>
                              }
                          </div>
                      }
                  </div>
              </div>
          </div>
      </div>
      
      <div class="mt-6 text-center">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">
              <i class="bi bi-info-circle-fill text-[#f06427]"></i> Los bloques marcados en color indican clases regulares. El laboratorio no admite reservas externas durante estos periodos.
          </p>
      </div>

    </div>
  `
})
export class ComponenteHorarioAcademico {
    data = inject(DataService);

    defaultLabs = ['DESARROLLO TECNOLOGICO', 'FABLAB', 'HACKERLAB', 'FISICA', 'QUIMICA'];

    dynamicLabs = computed(() => {
        const rawDbLabs = this.data.classSchedules().map(c => c.lab).filter(Boolean);
        const normDbLabs = rawDbLabs.map(l => this.normalizeLabName(l));
        const allLabs = Array.from(new Set([...this.defaultLabs, ...normDbLabs]));
        return allLabs.sort((a, b) => {
            const idxA = this.defaultLabs.indexOf(a);
            const idxB = this.defaultLabs.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    });

    selectedLab = signal('DESARROLLO TECNOLOGICO');
    isEditMode = signal(false);

    days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    timeBlocks = [
        '08:30 - 09:50',
        '10:00 - 11:20',
        '11:30 - 12:50',
        '13:00 - 14:20',
        '14:30 - 15:50',
        '16:00 - 17:20',
        '17:30 - 18:50'
    ];



    canEditSchedules = computed(() => {
        const role = this.data.currentUser()?.rol;
        return role === 'Admin_Labs' || role === 'Admin_Acade' || role === 'SuperUser';
    });

    normalizeLabName(name: string): string {
        if (!name) return '';
        const u = name.toUpperCase().trim();
        if (u === 'DT' || u.includes('DESARROLLO')) return 'DESARROLLO TECNOLOGICO';
        if (u.includes('FAB')) return 'FABLAB';
        if (u.includes('HACK')) return 'HACKERLAB';
        if (u.includes('FISIC')) return 'FISICA';
        if (u.includes('QUIMIC')) return 'QUIMICA';
        return u;
    }

    getLabDisplayName(lab: string): string {
        const norm = this.normalizeLabName(lab);
        if (norm === 'DESARROLLO TECNOLOGICO') return 'Desarrollo Tecnologico';
        if (norm === 'FABLAB') return 'FabLab';
        if (norm === 'HACKERLAB') return 'HackerLab';
        if (norm === 'FISICA') return 'Física';
        if (norm === 'QUIMICA') return 'Química';
        return lab;
    }

    getIcon(lab: string): string {
        const norm = this.normalizeLabName(lab);
        if (norm === 'FABLAB') return 'bi bi-printer-fill';
        if (norm === 'HACKERLAB') return 'bi bi-cpu-fill';
        if (norm === 'DESARROLLO TECNOLOGICO') return 'bi bi-code-square';
        if (norm === 'FISICA') return 'bi bi-lightning-fill';
        if (norm === 'QUIMICA') return 'bi bi-droplet-fill';
        return 'bi bi-building-fill';
    }

    getClass(day: string, block: string): ClassSchedule | undefined {
        const selNorm = this.normalizeLabName(this.selectedLab());

        return this.data.classSchedules().find(c =>
            this.normalizeLabName(c.lab) === selNorm &&
            c.day === day &&
            c.block === block
        );
    }

    getBgColor(color?: string): string {
        if (!color) return 'rgba(243, 244, 246, 0.5)';
        return color + '22';
    }

    getBorderColor(color?: string): string {
        if (!color) return 'transparent';
        return color;
    }

    getBadgeBgColor(color?: string): string {
        if (!color) return '#f3f4f6';
        return color + '40';
    }

    toggleEditMode() {
        this.isEditMode.update(v => !v);
    }

    async deleteCurrentLab() {
        const lab = this.selectedLab();
        Swal.fire({
            title: `¿Eliminar sala ${lab}?`,
            text: "Esta acción borrará permanentemente todo el cronograma y bloques horarios vinculados a este recinto. No se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar recinto',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#003366',
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                const success = await this.data.deleteLabSchedules(lab);
                if (success) {
                    this.selectedLab.set('DESARROLLO TECNOLOGICO');
                    Swal.fire('Eliminado', `La sala ${lab} y sus horarios han sido removidos del sistema.`, 'success');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar la sala. Verifique su conexión.', 'error');
                }
            }
        });
    }

    addNewLab() {
        Swal.fire({
            title: 'Nueva Sala / Laboratorio',
            input: 'text',
            inputPlaceholder: 'Ej. LABORATORIO DE BIOMATERIALES',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10b981',
            inputValidator: (value: string) => {
                if (!value) return 'Debes ingresar un nombre';
                if (this.dynamicLabs().includes(value.toUpperCase())) return 'Esa sala ya existe';
                return null;
            }
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                const newLab = result.value.toUpperCase();
                await this.data.updateSchedule({
                    lab: newLab,
                    day: 'HIDDEN',
                    block: 'HIDDEN',
                    subject: 'HIDDEN',
                    color: '#ffffff'
                });
                this.selectedLab.set(newLab);
                Swal.fire('Creado', `La sala ${newLab} ha sido añadida exitosamente.`, 'success');
            }
        });
    }

    async editCell(day: string, block: string, current?: ClassSchedule) {
        if (!this.isEditMode()) return;

        const currentSubject = current?.subject || '';

        Swal.fire({
            title: `Editar Horario`,
            html: `
                <div class="text-left space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre del Ramo / Docente</label>
                        <input id="swal-subject" class="swal2-input w-full m-0" placeholder="Ej: Programación Avanzada - Dr. Soto" value="${currentSubject}">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Etiqueta de Color</label>
                        <div class="flex flex-wrap gap-2 mt-2">
                             ${['#ec4899', '#16a34a', '#ea580c', '#9333ea', '#0284c7', '#3b82f6', '#ef4444'].map(c => `
                                <button type="button" onclick="document.getElementById('swal-color').value='${c}'; this.parentNode.querySelectorAll('button').forEach(b=>b.style.border='none'); this.style.border='3px solid #000';" 
                                        style="background-color: ${c}; width: 32px; height: 32px; border-radius: 8px; ${current?.color === c ? 'border: 3px solid #000;' : ''}"></button>
                             `).join('')}
                        </div>
                        <input type="hidden" id="swal-color" value="${current?.color || '#ec4899'}">
                    </div>
                </div>
            `,
            showCancelButton: true,
            showDenyButton: !!current?.id,
            confirmButtonText: 'Guardar',
            denyButtonText: 'Eliminar Horario',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#003366',
            denyButtonColor: '#ef4444',
            preConfirm: () => {
                return {
                    subject: (document.getElementById('swal-subject') as HTMLInputElement).value,
                    color: (document.getElementById('swal-color') as HTMLInputElement).value
                }
            }
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                const { subject, color } = result.value;

                if (subject.trim() === '') {
                    if (current?.id) {
                        await this.data.deleteSchedule(current.id);
                        Swal.fire({
                            icon: 'success',
                            title: 'Horario Eliminado',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                } else {
                    await this.data.updateSchedule({
                        id: current?.id,
                        lab: this.selectedLab(),
                        day,
                        block,
                        subject: subject.trim(),
                        color
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Horario Actualizado',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            } else if (result.isDenied && current?.id) {
                Swal.fire({
                    title: '¿Eliminar bloque?',
                    text: '¿Deseas quitar esta asignatura del horario?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#003366',
                }).then(async (delResult: any) => {
                    if (delResult.isConfirmed) {
                        await this.data.deleteSchedule(current.id);
                        Swal.fire({
                            icon: 'success',
                            title: 'Horario Eliminado',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                });
            }
        });
    }

    exportSchedule() {
        const currentLab = this.selectedLab();
        const data = this.days.flatMap(day => 
            this.timeBlocks.map(block => {
                const c = this.getClass(day, block);
                return c ? {
                    'Laboratorio': currentLab,
                    'Día': day,
                    'Bloque': block,
                    'Asignatura / Docente': c.subject
                } : null;
            }).filter(Boolean)
        );

        if (data.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin Datos',
                text: `No hay horarios registrados para ${currentLab} para exportar.`
            });
            return;
        }

        this.data.downloadCSV(data, `Horario_${currentLab}_${new Date().getFullYear()}`);
    }
}
