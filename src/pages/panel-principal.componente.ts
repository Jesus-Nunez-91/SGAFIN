import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { DataService, InventoryItem, Reservation } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import Chart from 'chart.js/auto';
declare var Swal: any;

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="space-y-10 animate-fadeIn pb-16">
      
      <!-- ================================================================= -->
      <!-- VISTA ADMINISTRADORES & ENCARGADOS DE LABORATORIO                 -->
      <!-- ================================================================= -->
      @if (isStaff()) {
        <!-- WELCOME HERO: Institutional Branding -->
        <div class="relative overflow-hidden bg-black p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-b-8 border-[#f06427] group">
          <div class="absolute -right-32 -top-32 w-[600px] h-[600px] bg-[#f06427] rounded-full blur-[180px] opacity-10 group-hover:opacity-20 transition-all duration-1000"></div>
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div class="space-y-4">
               <div class="flex items-center gap-3 mb-2">
                  <span class="px-4 py-1.5 bg-[#f06427]/10 text-[#f06427] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[#f06427]/30">Portal Administrativo UAH</span>
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Sistema Operativo</span>
               </div>
              <h1 class="text-3xl md:text-4xl lg:text-6xl font-black text-white tracking-tighter leading-none" style="font-family: 'Playfair Display', serif;">
                Hola, <span class="text-[#f06427]">{{ data.currentUser()?.nombreCompleto?.split(' ')[0] }}</span> 
              </h1>
              <p class="text-gray-400 font-medium text-sm md:text-lg max-w-2xl leading-relaxed">Gestión Integral y Aprobación de Reservas de Laboratorios UAH.</p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4 md:gap-6">
                <div class="bg-white/5 backdrop-blur-md px-6 md:px-10 py-4 md:py-6 rounded-3xl border border-white/10 flex items-center gap-4 md:gap-6 group/item hover:bg-white/10 transition-all">
                   <div class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#f06427] flex items-center justify-center text-white shadow-xl shadow-[#f06427]/20 group-hover/item:scale-110 transition-transform">
                      <i class="bi bi-clock-history text-2xl md:text-3xl"></i>
                   </div>
                   <div class="text-left">
                      <div class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-70">Pendientes por Aprobar</div>
                      <div class="text-xl md:text-3xl font-black text-white tracking-tight">{{ pendingReservations().length }} <span class="text-[10px] font-bold opacity-40 uppercase">Solicitudes</span></div>
                   </div>
                </div>
            </div>
          </div>
        </div>

        <!-- MAIN METRICS GRID -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div class="bg-white dark:bg-[#0f0f12] p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 group hover:border-[#f06427]/40 transition-all">
                <div class="flex justify-between items-center mb-6 md:mb-8">
                    <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:text-[#f06427] flex items-center justify-center text-xl md:text-2xl transition-colors">
                        <i class="bi bi-collection-fill"></i>
                    </div>
                    <span class="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">Equipamiento</span>
                </div>
                <div class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Disponible</div>
                <div class="text-3xl md:text-5xl font-black text-black dark:text-white tracking-tighter">{{ totalStockUnits() | number }}</div>
                <div class="text-[8px] md:text-[9px] font-bold text-[#f06427] mt-1 uppercase tracking-tighter">{{ data.inventory().length }} items</div>
            </div>

            <div class="bg-white dark:bg-[#0f0f12] p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 group hover:border-[#f06427]/40 transition-all">
                <div class="flex justify-between items-center mb-8">
                    <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center text-2xl transition-colors">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <span class="text-[9px] font-black text-amber-500 uppercase tracking-widest">Pendientes</span>
                </div>
                <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Por Aprobar</div>
                <div class="text-5xl font-black text-black dark:text-white tracking-tighter">{{ pendingReservations().length }}</div>
            </div>

            <div class="bg-white dark:bg-[#0f0f12] p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 group hover:border-[#f06427]/40 transition-all">
                <div class="flex justify-between items-center mb-8">
                    <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center text-2xl transition-colors">
                        <i class="bi bi-shield-fill-check"></i>
                    </div>
                    <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Activas</span>
                </div>
                <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">En Posesión</div>
                <div class="text-5xl font-black text-black dark:text-white tracking-tighter">{{ activeReservations().length }}</div>
            </div>

            <div class="bg-white dark:bg-[#0f0f12] p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 group hover:border-[#f06427]/40 transition-all">
                <div class="flex justify-between items-center mb-8">
                    <div class="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 flex items-center justify-center text-2xl transition-colors">
                        <i class="bi bi-exclamation-octagon-fill"></i>
                    </div>
                    <span class="text-[9px] font-black text-rose-500 uppercase tracking-widest">Crítico</span>
                </div>
                <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sin Stock</div>
                <div class="text-5xl font-black text-black dark:text-white tracking-tighter">{{ criticalStock().length }}</div>
            </div>
        </div>

        <!-- OPERATIONAL CORE: Tabla de Solicitudes de Reserva por Aprobar -->
        <div class="bg-white dark:bg-[#0f0f12] rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
            <div class="p-6 md:p-8 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex items-center gap-3 md:gap-4">
                   <div class="w-10 h-10 rounded-xl bg-[#f06427] text-white flex items-center justify-center shadow-lg">
                      <i class="bi bi-clipboard-check-fill text-xl"></i>
                   </div>
                   <div>
                       <h3 class="text-sm md:text-base font-black text-black dark:text-white uppercase tracking-widest">Gestión de Reservas</h3>
                       <p class="text-[10px] text-gray-400 font-bold">Administración integral y control de préstamos de laboratorios</p>
                   </div>
                </div>

                <!-- SELECTOR DE PESTAÑAS (TABS) -->
                <div class="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200/50 dark:border-white/5">
                    <button (click)="activeTab.set('pending')" [class.bg-white]="activeTab() === 'pending'" [class.dark:bg-white/10]="activeTab() === 'pending'" [class.text-black]="activeTab() === 'pending'" [class.dark:text-white]="activeTab() === 'pending'" [class.shadow-md]="activeTab() === 'pending'" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
                        Pendientes ({{ pendingReservations().length }})
                    </button>
                    <button (click)="activeTab.set('active')" [class.bg-white]="activeTab() === 'active'" [class.dark:bg-white/10]="activeTab() === 'active'" [class.text-black]="activeTab() === 'active'" [class.dark:text-white]="activeTab() === 'active'" [class.shadow-md]="activeTab() === 'active'" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
                        En Uso ({{ activeReservations().length }})
                    </button>
                    <button (click)="activeTab.set('history')" [class.bg-white]="activeTab() === 'history'" [class.dark:bg-white/10]="activeTab() === 'history'" [class.text-black]="activeTab() === 'history'" [class.dark:text-white]="activeTab() === 'history'" [class.shadow-md]="activeTab() === 'history'" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
                        Historial ({{ data.reservations().length }})
                    </button>
                </div>
            </div>

            <!-- CONTENIDO DE PESTAÑA: PENDIENTES -->
            @if (activeTab() === 'pending') {
                <div class="overflow-x-auto min-h-[300px]">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
                                <th class="p-6 pl-10">Solicitante</th>
                                <th class="p-6">Material Solicitado</th>
                                <th class="p-6">Fecha y Bloque</th>
                                <th class="p-6 text-center pr-10">Acciones de Control</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                            @for (res of pendingReservations(); track res.id) {
                                <tr class="hover:bg-blue-50/40 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td class="p-6 pl-10">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black group-hover:bg-[#f06427] transition-colors shadow-md">
                                                {{ ((res.nombreSolicitante || res.user || '?').charAt(0).toUpperCase()) }}
                                            </div>
                                            <div>
                                                <div class="text-sm font-bold text-black dark:text-white">{{ res.nombreSolicitante || res.user }}</div>
                                                <div class="text-[9px] font-black text-[#f06427] uppercase tracking-widest mt-1">{{ res.tipoUsuario || res.userRole || 'Solicitante' }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="flex items-center gap-3">
                                            <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
                                                {{ res.tipoItem || 'EQUIPO' }}
                                            </span>
                                            <div class="text-xs font-black text-black dark:text-gray-200 uppercase truncate max-w-[250px]">
                                                {{ res.detalle || getItem(res.equipoId)?.marca || ('Equipo #' + res.equipoId) }}
                                                @if (res.cantidad) {
                                                    <span class="text-[10px] text-gray-400 ml-1">({{ res.cantidad }} ud)</span>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight mb-0.5">
                                            {{ res.fecha || (res.createdAt | date:'dd-MM-yyyy') }}
                                        </div>
                                        <div class="text-[10px] font-bold text-[#f06427] uppercase tracking-widest">
                                            {{ res.bloque || (res.createdAt | date:'HH:mm HRS') }}
                                        </div>
                                    </td>
                                    <td class="p-6 pr-10 text-center">
                                        <div class="flex items-center justify-center gap-3">
                                            <button (click)="approve(res.id)" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-[10px] font-black tracking-widest uppercase shadow-md active:scale-95 flex items-center gap-1.5">
                                                <i class="bi bi-check-circle-fill text-sm"></i> APROBAR
                                            </button>
                                            <button (click)="reject(res.id)" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all text-[10px] font-black tracking-widest uppercase shadow-md active:scale-95 flex items-center gap-1.5">
                                                <i class="bi bi-x-circle-fill text-sm"></i> RECHAZAR
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            }
                            @if (pendingReservations().length === 0) {
                                <tr>
                                    <td colspan="4" class="p-16 text-center">
                                        <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-900">
                                            <i class="bi bi-check2-all text-3xl"></i>
                                        </div>
                                        <h4 class="font-black text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300">Todas las solicitudes al día</h4>
                                        <p class="text-[10px] text-gray-400 mt-1 font-semibold">No hay préstamos ni reservas pendientes de aprobación en este momento.</p>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            }

            <!-- CONTENIDO DE PESTAÑA: EN USO -->
            @if (activeTab() === 'active') {
                <div class="overflow-x-auto min-h-[300px]">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
                                <th class="p-6 pl-10">Solicitante</th>
                                <th class="p-6">Material en Posesión</th>
                                <th class="p-6">Fecha y Bloque</th>
                                <th class="p-6 text-center pr-10">Acciones de Control</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                            @for (res of activeReservations(); track res.id) {
                                <tr class="hover:bg-blue-50/40 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td class="p-6 pl-10">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 rounded-2xl bg-[#003366] text-white flex items-center justify-center font-black group-hover:bg-[#f06427] transition-colors shadow-md">
                                                {{ ((res.nombreSolicitante || res.user || '?').charAt(0).toUpperCase()) }}
                                            </div>
                                            <div>
                                                <div class="text-sm font-bold text-black dark:text-white">{{ res.nombreSolicitante || res.user }}</div>
                                                <div class="text-[9px] font-black text-[#f06427] uppercase tracking-widest mt-1">{{ res.tipoUsuario || res.userRole || 'Solicitante' }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="flex items-center gap-3">
                                            <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                {{ res.tipoItem || 'EQUIPO' }}
                                            </span>
                                            <div class="text-xs font-black text-black dark:text-gray-200 uppercase truncate max-w-[250px]">
                                                {{ res.detalle || getItem(res.equipoId)?.marca || ('Equipo #' + res.equipoId) }}
                                                @if (res.cantidad) {
                                                    <span class="text-[10px] text-gray-400 ml-1">({{ res.cantidad }} ud)</span>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight mb-0.5">
                                            {{ res.fecha || (res.createdAt | date:'dd-MM-yyyy') }}
                                        </div>
                                        <div class="text-[10px] font-bold text-[#f06427] uppercase tracking-widest">
                                            {{ res.bloque || (res.createdAt | date:'HH:mm HRS') }}
                                        </div>
                                    </td>
                                    <td class="p-6 pr-10 text-center">
                                        <div class="flex items-center justify-center gap-3">
                                            <button (click)="markAsReturned(res.id, res.cantidad)" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-[10px] font-black tracking-widest uppercase shadow-md active:scale-95 flex items-center gap-1.5">
                                                <i class="bi bi-arrow-down-left-circle-fill text-sm"></i> DEVOLVER
                                            </button>
                                            <button (click)="cancelReservation(res.id)" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-all text-[10px] font-black tracking-widest uppercase shadow-md active:scale-95 flex items-center gap-1.5">
                                                <i class="bi bi-x-circle-fill text-sm"></i> CANCELAR
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            }
                            @if (activeReservations().length === 0) {
                                <tr>
                                    <td colspan="4" class="p-16 text-center">
                                        <div class="w-16 h-16 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-white/10">
                                            <i class="bi bi-shield-slash text-3xl"></i>
                                        </div>
                                        <h4 class="font-black text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300">Sin materiales activos</h4>
                                        <p class="text-[10px] text-gray-400 mt-1 font-semibold">No hay ningún material ni laboratorio en uso o posesión actualmente.</p>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            }

            <!-- CONTENIDO DE PESTAÑA: HISTORIAL COMPLETO -->
            @if (activeTab() === 'history') {
                <div class="overflow-x-auto min-h-[300px]">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
                                <th class="p-6 pl-10">Solicitante</th>
                                <th class="p-6">Material</th>
                                <th class="p-6">Fecha y Bloque</th>
                                <th class="p-6 text-center">Estado</th>
                                <th class="p-6 text-center pr-10">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                            @for (res of data.reservations(); track res.id) {
                                <tr class="hover:bg-blue-50/40 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td class="p-6 pl-10">
                                        <div class="flex items-center gap-4">
                                            <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 flex items-center justify-center font-black group-hover:bg-[#f06427] group-hover:text-white transition-colors shadow-md">
                                                {{ ((res.nombreSolicitante || res.user || '?').charAt(0).toUpperCase()) }}
                                            </div>
                                            <div>
                                                <div class="text-sm font-bold text-black dark:text-white">{{ res.nombreSolicitante || res.user }}</div>
                                                <div class="text-[9px] font-black text-[#f06427] uppercase tracking-widest mt-1">{{ res.tipoUsuario || res.userRole || 'Solicitante' }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="flex items-center gap-3">
                                            <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300">
                                                {{ res.tipoItem || 'EQUIPO' }}
                                            </span>
                                            <div class="text-xs font-black text-black dark:text-gray-200 uppercase truncate max-w-[250px]">
                                                {{ res.detalle || getItem(res.equipoId)?.marca || ('Equipo #' + res.equipoId) }}
                                                @if (res.cantidad) {
                                                    <span class="text-[10px] text-gray-400 ml-1">({{ res.cantidad }} ud)</span>
                                                }
                                            </div>
                                        </div>
                                    </td>
                                    <td class="p-6">
                                        <div class="text-[11px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-tight mb-0.5">
                                            {{ res.fecha || (res.createdAt | date:'dd-MM-yyyy') }}
                                        </div>
                                        <div class="text-[10px] font-bold text-[#f06427] uppercase tracking-widest">
                                            {{ res.bloque || (res.createdAt | date:'HH:mm HRS') }}
                                        </div>
                                    </td>
                                    <td class="p-6 text-center">
                                        @if (res.aprobada && res.devuelto >= res.cantidad) {
                                            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                                                <i class="bi bi-check-circle-fill"></i> DEVUELTO
                                            </span>
                                        } @else if (res.aprobada && res.devuelto < res.cantidad) {
                                            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200">
                                                <i class="bi bi-shield-fill-check"></i> EN POSESIÓN
                                            </span>
                                        } @else if (res.rechazada) {
                                            <div class="flex flex-col items-center gap-1">
                                                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200">
                                                    <i class="bi bi-x-circle-fill"></i> RECHAZADA
                                                </span>
                                                @if (res.motivoRechazo) {
                                                    <span class="text-[8px] text-rose-600 dark:text-rose-400 font-bold max-w-[150px] truncate" title="{{ res.motivoRechazo }}">
                                                        {{ res.motivoRechazo }}
                                                    </span>
                                                }
                                            </div>
                                        } @else {
                                            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
                                                <i class="bi bi-clock-history"></i> PENDIENTE
                                            </span>
                                        }
                                    </td>
                                    <td class="p-6 pr-10 text-center">
                                        <button (click)="deleteReservation(res.id)" class="px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white dark:hover:text-white text-gray-500 dark:text-gray-400 transition-all text-[9px] font-black tracking-widest uppercase active:scale-95">
                                            <i class="bi bi-trash3-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            }
                            @if (data.reservations().length === 0) {
                                <tr>
                                    <td colspan="5" class="p-16 text-center">
                                        <div class="w-16 h-16 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-white/10">
                                            <i class="bi bi-journal-x text-3xl"></i>
                                        </div>
                                        <h4 class="font-black text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300">Historial vacío</h4>
                                        <p class="text-[10px] text-gray-400 mt-1 font-semibold">No se registran transacciones históricas en el sistema.</p>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>

        <!-- MONITOREO DE CLASES EN TIEMPO REAL (5 LABORATORIOS EN VIVO) -->
        <div class="bg-black text-white rounded-[2rem] shadow-2xl p-6 md:p-8 border border-white/10 space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-[#f06427] text-white flex items-center justify-center shadow-lg">
                        <i class="bi bi-broadcast text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-sm md:text-base font-black uppercase tracking-widest text-white">Monitoreo de Clases en Tiempo Real</h3>
                        <p class="text-[10px] text-gray-400 font-bold">Ocupación y estado actual de los 5 recintos académicos</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                    <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">En Vivo ({{ currentTimeDisplay() }})</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                @for (item of currentClassStatus(); track item.lab) {
                    <div class="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-[#f06427]/40 transition-all">
                        <div class="flex justify-between items-center">
                            <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">{{ item.lab }}</span>
                            @if (item.activeClass) {
                                <span class="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">CLASE EN CURSO</span>
                            } @else if (item.status === 'DISPONIBLE') {
                                <span class="px-2 py-0.5 rounded text-[8px] font-black bg-blue-500/20 text-blue-400 border border-blue-500/40 uppercase">DISPONIBLE</span>
                            } @else {
                                <span class="px-2 py-0.5 rounded text-[8px] font-black bg-gray-500/20 text-gray-400 border border-gray-500/40 uppercase">SIN BLOQUE</span>
                            }
                        </div>

                        <div>
                            @if (item.activeClass) {
                                <div class="font-black text-sm text-white leading-tight line-clamp-2">{{ item.activeClass }}</div>
                                <div class="text-[9px] text-[#f06427] font-bold mt-1 uppercase">{{ item.currentBlockName }}</div>
                            } @else {
                                <div class="font-bold text-xs text-gray-400 italic">Sin clases programadas</div>
                                <div class="text-[9px] text-gray-500 font-semibold mt-1 uppercase">{{ item.currentBlockName }}</div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>

        <!-- MIS SOLICITUDES PERSONALES (VISTA ADMINISTRADOR) -->
        @if (myReservations().length > 0) {
            <div class="bg-white dark:bg-[#0f0f12] rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div class="p-6 bg-gray-50/60 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#003366] text-white flex items-center justify-center shadow-md">
                            <i class="bi bi-journal-text text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-sm font-black text-black dark:text-white uppercase tracking-widest">Mis Solicitudes Personales</h3>
                            <p class="text-[10px] text-gray-400 font-bold">Estado de las reservas que has solicitado</p>
                        </div>
                    </div>
                    <span class="text-[10px] font-black bg-[#003366] text-white px-3 py-1.5 rounded-xl uppercase tracking-widest">
                        {{ myReservations().length }} Registradas
                    </span>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 bg-gray-50/30">
                                <th class="p-4 pl-6">Recurso / Material</th>
                                <th class="p-4">Fecha y Bloque</th>
                                <th class="p-4 text-center">Estado y Motivo</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                            @for (res of myReservations(); track res.id) {
                                <tr class="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                    <td class="p-4 pl-6">
                                        <div class="font-bold text-black dark:text-white text-xs uppercase">
                                            {{ res.detalle || getItem(res.equipoId)?.marca || ('Equipo #' + res.equipoId) }}
                                        </div>
                                        <div class="text-[9px] text-gray-400 font-semibold mt-0.5">
                                            Cantidad: {{ res.cantidad }} unidad(es)
                                        </div>
                                    </td>
                                    <td class="p-4">
                                        <div class="text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {{ res.fecha || (res.createdAt | date:'dd-MM-yyyy') }}
                                        </div>
                                        <div class="text-[10px] font-bold text-[#f06427]">
                                            {{ res.bloque || (res.createdAt | date:'HH:mm HRS') }}
                                        </div>
                                    </td>
                                    <td class="p-4 text-center">
                                        @if (res.aprobada) {
                                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                                                <i class="bi bi-check-circle-fill"></i> APROBADA
                                            </span>
                                        } @else if (res.rechazada) {
                                            <div class="flex flex-col items-center gap-1">
                                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200">
                                                    <i class="bi bi-x-circle-fill"></i> RECHAZADA
                                                </span>
                                                @if (res.motivoRechazo) {
                                                    <span class="text-[9px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 max-w-xs truncate" title="{{ res.motivoRechazo }}">
                                                        Motivo: {{ res.motivoRechazo }}
                                                    </span>
                                                }
                                            </div>
                                        } @else {
                                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
                                                <i class="bi bi-clock-history"></i> PENDIENTE
                                            </span>
                                        }
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        }
      }

      <!-- ================================================================= -->
      <!-- VISTA DOCENTES Y ALUMNOS (PORTAL ALUMNO / DOCENTE)               -->
      <!-- ================================================================= -->
      @else {
        <!-- HERO DOCENTE / ALUMNO -->
        <div class="relative overflow-hidden bg-black p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border-b-8 border-[#f06427]">
          <div class="absolute -right-32 -top-32 w-[500px] h-[500px] bg-[#f06427] rounded-full blur-[160px] opacity-15"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-3">
               <div class="flex items-center gap-3">
                  <span class="px-4 py-1.5 bg-[#f06427]/20 text-[#f06427] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[#f06427]/40">
                     Portal {{ data.currentUser()?.rol || 'Estudiantil' }} UAH
                  </span>
               </div>
              <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter">
                ¡Bienvenido/a, <span class="text-[#f06427]">{{ data.currentUser()?.nombreCompleto?.split(' ')[0] }}</span>!
              </h1>
              <p class="text-gray-400 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
                Sistema de Gestión y Consulta de Reservas de Materiales y Laboratorios Académicos.
              </p>
            </div>

            <div class="flex gap-3">
              <a routerLink="/laboratorios" class="bg-[#f06427] hover:bg-orange-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-xl shadow-orange-500/20 text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                <i class="bi bi-box-seam-fill text-base"></i> Solicitar Reserva
              </a>
              <a routerLink="/horario-academico" class="bg-white/10 hover:bg-white/20 text-white font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all border border-white/10">
                <i class="bi bi-calendar-week-fill text-base text-[#f06427]"></i> Ver Horarios
              </a>
            </div>
          </div>
        </div>

        <!-- GRID PRINCIPAL DE ESTUDIANTE / DOCENTE -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- COLUMNA IZQUIERDA: ESTADO DE MIS SOLICITUDES DE RESERVA -->
            <div class="lg:col-span-8 space-y-8">
                <div class="bg-white dark:bg-[#0f0f12] rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div class="p-6 bg-gray-50/60 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-[#003366] text-white flex items-center justify-center shadow-md">
                                <i class="bi bi-journal-text text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-black text-black dark:text-white uppercase tracking-widest">Mis Solicitudes de Reserva</h3>
                                <p class="text-[10px] text-gray-400 font-bold">Estado en tiempo real de tus pedidos</p>
                            </div>
                        </div>
                        <span class="text-[10px] font-black bg-[#003366] text-white px-3 py-1.5 rounded-xl uppercase tracking-widest">
                            {{ myReservations().length }} Registradas
                        </span>
                    </div>

                    <div class="overflow-x-auto min-h-[250px]">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 bg-gray-50/30">
                                    <th class="p-4 pl-6">Recurso / Material</th>
                                    <th class="p-4">Fecha y Bloque</th>
                                    <th class="p-4 text-center">Estado Solicitud</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 dark:divide-white/5">
                                @for (res of myReservations(); track res.id) {
                                    <tr class="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td class="p-4 pl-6">
                                            <div class="font-bold text-black dark:text-white text-xs uppercase">
                                                {{ res.detalle || getItem(res.equipoId)?.marca || ('Equipo #' + res.equipoId) }}
                                            </div>
                                            <div class="text-[9px] text-gray-400 font-semibold mt-0.5">
                                                Cantidad: {{ res.cantidad }} unidad(es)
                                            </div>
                                        </td>
                                        <td class="p-4">
                                            <div class="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                {{ res.fecha || (res.createdAt | date:'dd-MM-yyyy') }}
                                            </div>
                                            <div class="text-[10px] font-bold text-[#f06427]">
                                                {{ res.bloque || (res.createdAt | date:'HH:mm HRS') }}
                                            </div>
                                        </td>
                                        <td class="p-4 text-center">
                                            @if (res.aprobada) {
                                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                                                    <i class="bi bi-check-circle-fill"></i> APROBADA
                                                </span>
                                            } @else if (res.rechazada) {
                                                <div class="flex flex-col items-center gap-1">
                                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200">
                                                        <i class="bi bi-x-circle-fill"></i> RECHAZADA
                                                    </span>
                                                    @if (res.motivoRechazo) {
                                                        <span class="text-[9px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 max-w-xs truncate" title="{{ res.motivoRechazo }}">
                                                            Motivo: {{ res.motivoRechazo }}
                                                        </span>
                                                    }
                                                </div>
                                            } @else {
                                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
                                                    <i class="bi bi-clock-history"></i> PENDIENTE
                                                </span>
                                            }
                                        </td>
                                    </tr>
                                }
                                @if (myReservations().length === 0) {
                                    <tr>
                                        <td colspan="3" class="p-12 text-center">
                                            <div class="w-12 h-12 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <i class="bi bi-inbox text-2xl"></i>
                                            </div>
                                            <p class="font-bold text-xs uppercase tracking-widest text-gray-500">No tienes solicitudes de reserva registradas.</p>
                                            <a routerLink="/laboratorios" class="inline-block mt-3 text-xs font-black text-[#f06427] hover:underline uppercase">Ir a solicitar material &rarr;</a>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- COLUMNA DERECHA: POLÍTICAS DE RESPONSABILIDAD Y ACCESOS DIRECTOS -->
            <div class="lg:col-span-4 space-y-6">
                <!-- CARD ACCESO DIRECTO A HORARIOS ACADÉMICOS -->
                <div class="bg-gradient-to-br from-[#003366] to-blue-950 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f06427]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                    <div class="relative z-10 space-y-4">
                        <div class="w-12 h-12 rounded-2xl bg-[#f06427] text-white flex items-center justify-center text-2xl shadow-lg">
                            <i class="bi bi-calendar-week-fill"></i>
                        </div>
                        <div>
                            <h4 class="font-black text-lg uppercase tracking-tight">Horarios Académicos S2-2026</h4>
                            <p class="text-xs text-blue-200 mt-1 leading-relaxed">Consulta la distribución de los 5 laboratorios (FabLab, HackerLab, DT, Física, Química) en tiempo real.</p>
                        </div>
                        <a routerLink="/horario-academico" class="inline-flex items-center gap-2 bg-white text-[#003366] font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest hover:bg-gray-100 transition-all shadow-md">
                            Consultar Horarios <i class="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>

                <!-- CARD POLÍTICAS DE RESPONSABILIDAD INSTITUCIONAL -->
                <div class="bg-white dark:bg-[#0f0f12] rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-white/5 space-y-4">
                    <div class="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                        <div class="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-[#f06427] flex items-center justify-center text-xl">
                            <i class="bi bi-shield-lock-fill"></i>
                        </div>
                        <div>
                            <h4 class="font-black text-xs uppercase tracking-widest text-black dark:text-white">Políticas de Responsabilidad</h4>
                            <p class="text-[10px] text-gray-400 font-bold">Uso y Retiro de Equipamiento UAH</p>
                        </div>
                    </div>

                    <div class="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                        <div class="flex items-start gap-2.5">
                            <i class="bi bi-clock-fill text-[#f06427] text-sm mt-0.5"></i>
                            <div>
                                <strong class="text-black dark:text-gray-200">Devolución en Fecha y Bloque:</strong> Los materiales deben retornarse estrictamente dentro del horario acordado.
                            </div>
                        </div>
                        <div class="flex items-start gap-2.5">
                            <i class="bi bi-exclamation-triangle-fill text-[#f06427] text-sm mt-0.5"></i>
                            <div>
                                <strong class="text-black dark:text-gray-200">Cuidado del Equipamiento:</strong> El alumno o docente solicitante es responsable del estado físico y custodia del bien asignado.
                            </div>
                        </div>
                        <div class="flex items-start gap-2.5">
                            <i class="bi bi-card-heading text-[#f06427] text-sm mt-0.5"></i>
                            <div>
                                <strong class="text-black dark:text-gray-200">Retiro con Cédula/RUT:</strong> Al retirar el material en el laboratorio se debe presentar la credencial institucional o RUT.
                            </div>
                        </div>
                    </div>

                    <div class="pt-2 border-t border-gray-100 dark:border-white/5 text-center">
                        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                            Reglamento Oficial de Laboratorios UAH
                        </span>
                    </div>
                </div>
            </div>
        </div>
      }
    </div>
  `
})
export class ComponentePanelPrincipal implements OnInit {
    data = inject(DataService);
    router = inject(Router);

    currentTimeDisplay = signal('');
    activeTab = signal('pending');
    activeInLab = computed(() => this.data.reservations().filter(r => r.aprobada && !r.rechazada && r.devuelto < r.cantidad));

    isStaff = computed(() => {
        const role = this.data.currentUser()?.rol;
        return ['Admin_Labs', 'SuperUser', 'Administrador', 'Encargado Laboratorio', 'Admin_Acade'].includes(role || '');
    });

    totalStockUnits = computed(() => {
        return this.data.inventory().reduce((acc, item) => acc + (item.stockActual || 0), 0);
    });

    pendingReservations = computed(() => {
        return this.data.reservations().filter(r => !r.aprobada && !r.rechazada);
    });

    activeReservations = computed(() => {
        return this.data.reservations().filter(r => r.aprobada && !r.rechazada && r.devuelto < r.cantidad);
    });

    criticalStock = computed(() => {
        return this.data.inventory().filter(i => i.stockActual === 0 || (i.stockMinimo > 0 && i.stockActual < i.stockMinimo));
    });

    currentClassStatus = computed(() => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const now = new Date();
        const dayName = days[now.getDay()];
        const HH = now.getHours();
        const MM = now.getMinutes();
        const totalMinutes = HH * 60 + MM;

        const timeBlocks = [
            { name: '08:30 - 09:50', start: 8 * 60 + 30, end: 9 * 60 + 50 },
            { name: '10:00 - 11:20', start: 10 * 60 + 0, end: 11 * 60 + 20 },
            { name: '11:30 - 12:50', start: 11 * 60 + 30, end: 12 * 60 + 50 },
            { name: '13:00 - 14:20', start: 13 * 60 + 0, end: 14 * 60 + 20 },
            { name: '14:30 - 15:50', start: 14 * 60 + 30, end: 15 * 60 + 50 },
            { name: '16:00 - 17:20', start: 16 * 60 + 0, end: 17 * 60 + 20 },
            { name: '17:30 - 18:50', start: 17 * 60 + 30, end: 18 * 60 + 50 },
        ];

        const currentBlock = timeBlocks.find(b => totalMinutes >= b.start && totalMinutes <= b.end);
        const labs = ['FABLAB', 'HACKERLAB', 'DESARROLLO TECNOLOGICO', 'FISICA', 'QUIMICA'];

        return labs.map(lab => {
            const activeClass = currentBlock 
                ? this.data.classSchedules().find(c => c.lab === lab && c.day === dayName && c.block === currentBlock.name)
                : null;
            
            return {
                lab,
                currentBlockName: currentBlock ? currentBlock.name : 'Fuera de Bloque',
                activeClass: activeClass ? activeClass.subject : null,
                status: activeClass ? 'CLASE EN CURSO' : (currentBlock ? 'DISPONIBLE' : 'SIN BLOQUE')
            };
        });
    });

    myReservations = computed(() => {
        const user = this.data.currentUser();
        if (!user) return [];
        return this.data.reservations().filter(r => 
            r.solicitanteId === user.id || 
            r.user === user.correo || 
            r.nombreSolicitante === user.nombreCompleto ||
            (user.correo && r.user && r.user.toLowerCase() === user.correo.toLowerCase())
        );
    });

    ngOnInit() {
        // Cargar reservaciones e inventario siempre
        this.data.fetchReservations();
        this.data.fetchInventory();

        if (this.isStaff()) {
            this.loadRooms();
            this.loadRoomReservationsToday();
            this.data.fetchUnifiedRequests();

            setInterval(() => {
                this.loadRooms();
                this.loadRoomReservationsToday();
            }, 60000);

            setTimeout(() => this.initCharts(), 500);
        }

        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const HH = now.getHours().toString().padStart(2, '0');
        const mm = now.getMinutes().toString().padStart(2, '0');
        const ss = now.getSeconds().toString().padStart(2, '0');
        this.currentTimeDisplay.set(`${HH}:${mm}:${ss}`);
    }

    approve(id: number) {
        this.data.updateReservationStatus(id, 'approve');
        Swal.fire({
            icon: 'success',
            title: 'Solicitud Aprobada',
            text: 'La reserva ha sido aprobada exitosamente y el inventario ha sido actualizado.',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500
        });
    }

    reject(id: number) {
        Swal.fire({
            title: '¿Rechazar Reserva?',
            text: 'Ingresa el motivo del rechazo para informar al solicitante:',
            input: 'text',
            inputPlaceholder: 'Ej: Equipos en mantenimiento o falta de disponibilidad',
            showCancelButton: true,
            confirmButtonText: 'Sí, Rechazar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e11d48'
        }).then((res: any) => {
            if (res.isConfirmed) {
                this.data.updateReservationStatus(id, 'reject', { motivo: res.value });
                Swal.fire({
                    icon: 'info',
                    title: 'Solicitud Rechazada',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500
                });
            }
        });
    }

    markAsReturned(id: number, cantidad: number) {
        Swal.fire({
            title: '¿Registrar Devolución?',
            text: '¿Confirmas que se ha devuelto todo el equipamiento de esta reserva?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, Registrar Devolución',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#10b981'
        }).then((res: any) => {
            if (res.isConfirmed) {
                this.data.updateReservationStatus(id, 'approve', { devuelto: cantidad });
                Swal.fire({
                    icon: 'success',
                    title: 'Devolución Registrada',
                    text: 'El equipamiento ha sido devuelto al stock.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500
                });
            }
        });
    }

    cancelReservation(id: number) {
        Swal.fire({
            title: '¿Cancelar Reserva Activa?',
            text: 'Esta reserva se encuentra aprobada. ¿Estás seguro de que deseas cancelarla? Se revertirá al estado de Rechazada.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Cancelar',
            cancelButtonText: 'Mantener Activa',
            confirmButtonColor: '#e11d48'
        }).then((res: any) => {
            if (res.isConfirmed) {
                this.data.updateReservationStatus(id, 'reject', { motivo: 'Cancelada por Administrador' });
                Swal.fire({
                    icon: 'info',
                    title: 'Reserva Cancelada',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500
                });
            }
        });
    }

    deleteReservation(id: number) {
        Swal.fire({
            title: '¿Eliminar Registro?',
            text: 'Esta acción eliminará permanentemente el registro de la base de datos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#374151'
        }).then(async (res: any) => {
            if (res.isConfirmed) {
                const ok = await this.data.deleteLaboratoryReservation(id);
                if (ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro Eliminado',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            }
        });
    }

    loadRooms() { }
    loadRoomReservationsToday() { }

    getItem(id: number): InventoryItem | undefined {
        return this.data.inventory().find(i => i.id === id);
    }

    initCharts() {
        this.initInventoryChart();
    }

    initInventoryChart() {
        const ctx = document.getElementById('inventoryChart') as HTMLCanvasElement;
        if (!ctx) return;

        const labs = ['FABLAB', 'CIENCIAS', 'INFORMATICA'];
        const dataCounts = labs.map(l => this.data.inventory().filter(i => i.categoria.includes(l)).length);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labs,
                datasets: [{
                    data: dataCounts,
                    backgroundColor: ['#003366', '#F37021', '#1e293b'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { family: 'Inter', size: 11 } } }
                }
            }
        });
    }
}
