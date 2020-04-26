import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avoidNull'
})
export class AvoidNullPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value : 'Sin seleccionar';
  }

}
